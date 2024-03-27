using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static readonly HttpClient client = new HttpClient();

    static async Task Main(string[] args)
    {
        try
        {
            // Base URL for the request
            string baseUrl = "http://localhost:3000/data";

            // Building the query string
            var queryString = "?course=cloud_computing&level=1&position=2";

            // Combine the base URL with the query string
            string url = baseUrl + queryString;

            // Send a GET request to the specified Uri as an asynchronous operation.
            HttpResponseMessage response = await client.GetAsync(url);

            // Ensure we get a successful response.
            response.EnsureSuccessStatusCode();

            // Read the response content as a string asynchronously.
            string responseBody = await response.Content.ReadAsStringAsync();

            string modifiedString = responseBody.Substring(1, responseBody.Length - 2);

            var responseObject = JsonConvert.DeserializeObject<Dictionary<string, object>>(modifiedString);

            Console.WriteLine(responseObject["frage"]);
        }
        catch(HttpRequestException e)
        {
            // Handle exception
            Console.WriteLine("\nException Caught!");
            Console.WriteLine("Message :{0} ",e.Message);
        }
    }
}
