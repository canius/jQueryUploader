using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Cus.jQueryUploader
{
    /// <summary>
    /// upload 的摘要说明
    /// </summary>
    public class upload : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            HttpPostedFile item = context.Request.Files["file"];
            string virtualPath = "~/attached/" + item.FileName;
            string path = context.Server.MapPath(virtualPath);
            item.SaveAs(path);
            string url = VirtualPathUtility.ToAbsolute(virtualPath);
            context.Response.Write(url);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}