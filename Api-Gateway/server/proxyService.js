const {createProxyMiddleware, fixRequestBody} = require("http-proxy-middleware")

class ProxyService{
    static createProxy(target){
        return createProxyMiddleware({
            target:target,
            changeOrigin:true,
            pathRewrite:(path, req) =>path.replace(req.baseUrl,""),
            onProxyReq:(proxyReq, req)=>{
                if(req.body && Object.keys(req.body).length){
                    const bodyData = JSON.stringify(req.body);

                    proxyReq.setHeader('Content-Type', 'aplication/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                }
            }
        })
    }
}

module.exports=ProxyService;