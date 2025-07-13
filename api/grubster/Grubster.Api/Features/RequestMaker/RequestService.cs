using System.Diagnostics;
using System.Net;
using Grubster.Api.Features.RequestMaker.Types;

namespace Grubster.Api.Features.RequestMaker;

public class RequestService
{
    private readonly HttpClient _httpClient;

    public RequestService(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task<RequestMakerResponse> PerformRequest(RequestMakerRequest request)
    {
        var stopwatch = new Stopwatch();

        try
        {
            _httpClient.Timeout = TimeSpan.FromSeconds(10);
            _httpClient.DefaultRequestHeaders.Add("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
            _httpClient.DefaultRequestHeaders.Add("Accept-Language","en-GB,en-US;q=0.9,en;q=0.8");
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            foreach (var header in request.Headers)
            {
                if (header.Key.ToLower() == "Content-Type".ToLower())
                    continue;
                
                _httpClient.DefaultRequestHeaders.Add(header.Key, header.Value);
            }
            
            HttpResponseMessage result = null;
            
            switch (request.Method.ToUpper())
            {
                case "GET":
                    stopwatch.Start();
                    result = await _httpClient.GetAsync(request.Url).ConfigureAwait(false);
                    stopwatch.Stop();
                    break;
                case "POST":
                    stopwatch.Start();
                    result = await _httpClient.PostAsync(request.Url, new StringContent(request.Body)).ConfigureAwait(false);
                    stopwatch.Stop();
                    break;
                case "PUT":
                    stopwatch.Start();
                    result = await _httpClient.PutAsync(request.Url, new StringContent(request.Body)).ConfigureAwait(false);
                    stopwatch.Stop();
                    break;
                case "PATCH":
                    stopwatch.Start();
                    result = await _httpClient.PatchAsync(request.Url, new StringContent(request.Body)).ConfigureAwait(false);
                    stopwatch.Stop();
                    break;
                case "DELETE":
                    stopwatch.Start();
                    result = await _httpClient.DeleteAsync(request.Url).ConfigureAwait(false);
                    stopwatch.Stop();
                    break;
            }

            if (result == null)
            {
                return new RequestMakerResponse
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    StatusDescription = "No response received.",
                    DurationInMilliseconds = stopwatch.ElapsedMilliseconds
                };
            }
            
            var responseMessage = await result.Content.ReadAsStringAsync().ConfigureAwait(false);

            return new RequestMakerResponse
            {
                StatusCode = result.StatusCode,
                StatusDescription = result.ReasonPhrase,
                DurationInMilliseconds = stopwatch.ElapsedMilliseconds,
                Body = responseMessage,
                Headers = result.Headers.Select(x => new KeyValuePair<string, string>(x.Key, x.Value.First())).ToList()
            };
        }
        catch (Exception e)
        {
            stopwatch.Stop();

            return new RequestMakerResponse
            {
                StatusCode = HttpStatusCode.InternalServerError,
                StatusDescription = e.Message,
                DurationInMilliseconds = stopwatch.ElapsedMilliseconds,
            };
        }
    }
}