using System.Net;

namespace Grubster.Api.Features.RequestMaker.Types;

public class RequestMakerResponse
{
    public RequestMakerResponse()
    {
        Headers = new List<KeyValuePair<string, string>>();
    }
    
    public HttpStatusCode StatusCode { get; set; }
    public string? StatusDescription { get; set; }
    public long DurationInMilliseconds { get; set; }
    public string Body { get; set; }
    public List<KeyValuePair<string, string>> Headers { get; set; }
}