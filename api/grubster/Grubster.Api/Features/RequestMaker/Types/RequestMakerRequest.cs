using System.Net;

namespace Grubster.Api.Features.RequestMaker.Types;

public class RequestMakerRequest
{
    public RequestMakerRequest()
    {
        Headers = new List<RequestHeader>();
    }
    
    public string Method { get; set; }
    public string Url { get; set; }
    public List<RequestHeader> Headers { get; set; }
    public string Body { get; set; }
    public Settings Settings { get; set; }
}