import Message from "element-ui/packages/message";

let common = {
    blobDownLoad(res) {
        if (res.data.type) {
            // 文件下载
            const blob = new Blob([res.data], {
                type: "application/vnd.ms-excel"
            });
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            let contentDisposition = res.headers['content-disposition'];
            let fileName = ''
            if (contentDisposition) {
                fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1], "UTF-8");
                link.setAttribute('download', fileName);
                link.click();
                link = null;
                Message.success('操作成功');
            } else {
                Message.error('操作失败')
            }
        } else {
            Message.warning(res.data.msg);
        }
    }
}

export default common
