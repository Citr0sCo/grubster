using Grubster.Api.Features.RequestMaker.Types;
using Microsoft.AspNetCore.Mvc;

namespace Grubster.Api.Features.RequestMaker;

[ApiController]
[Route("api/[controller]")]
public class RequestController : ControllerBase
{
    private readonly RequestService _service;

    public RequestController(IHttpClientFactory httpClientFactory)
    {
        _service = new RequestService(httpClientFactory);
    }

    [HttpPost]
    public async Task<RequestMakerResponse> Get([FromBody] RequestMakerRequest request)
    {
        return await _service.PerformRequest(request).ConfigureAwait(false);
    }
}