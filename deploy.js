const { exec } = require('child_process');
const { Client } = require('ssh2');
const ssh2Client = new Client();

const localPath = './assets.tar.gz';
const romotePath = '/root/web/nice-todo-nest/assets.tar.gz';

/**
 * ChildProcess.exec 开启一个子进程执行一段脚本，将执行的结果通过回调函数输出
 * 返回一个子进程
 * 将项目件打成assets.tar.gz压缩包
 */
let buildProject = exec(
  'tar --exclude node_modules --exclude logs --exclude dist -zcvf assets.tar.gz ./* ',
  (error, stdout, stderr) => {
    if (error) {
      console.log(`构建压缩包时出现异常${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  },
);
buildProject.stdout.pipe(process.stdout);
// 监听进程的结束
buildProject.on('exit', () => {
  console.log('资源压缩完成，开始上传压缩包至服务器');
    uploadProjectFile();
});

// 上传文件到服务器
function uploadProjectFile() {
  ssh2Client
    .on('ready', () => {
      console.log('服务器连接成功！');
      ssh2Client.sftp((err, sftp) => {
        if (err) throw err;
        sftp.fastPut(localPath, romotePath, {}, (error, result) => {
          if (error) throw error;
          deployProject(ssh2Client);
        });
      });
    })
    .connect({
      host: '129.211.164.125', // 服务器 host
      port: 22, // 服务器 port
      username: 'root', // 服务器用户名
      password: 'chen815600!@#', // 服务器密码
    });
}

// 执行脚本部署项目
function deployProject(ssh2Client) {
  console.log('资源成功上传至服务器！，开始执行部署脚本！');
  ssh2Client.shell((err, stream) => {
    if (err) throw err;
    stream
      .end(
        // cd 服务器存放 assets.tar.gz 文件的目录
        // 解压 assets.tar.gz
        // 删除 assets.tar.gz 解压后文件（慎重）
        // 构建docker 镜像
        // 退出
        `
        cd /root/web/nice-todo-nest
        tar zxvf assets.tar.gz
        ls
        rm -rf assets.tar.gz
        ls
        echo '开始安装依赖'
        npm install
        echo '开始打包镜像'
        sudo docker stop nice-todo-nest || true
        sudo docker rm nice-todo-nest || true
        sudo docker build -t nice-todo-nest .
        sudo docker run -d --privileged=true --name nice-todo-nest -p 4000:4000 -v /root/web/nice-todo-nest:/home/project nice-todo-nest
        exit
        `,
      )
      .on('data', (data) => {
        // 输出部署时的信息
        console.log(data.toString());
      })
      .on('close', () => {
        console.log('部署成功');
        ssh2Client.end();
      });
  });
}
