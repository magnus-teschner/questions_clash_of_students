using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using JWT.Exceptions;
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        string token = null; // Declare the token variable outside the try block

        try
        {
            var payload = new Dictionary<string, object>
            {
                { "claim1", 0 },
                { "claim2", "claim2-value" }
            };

            const string key = "yourSecretKey"; // Symmetric key for HMACSHA256
            IJwtAlgorithm algorithm = new HMACSHA256Algorithm(); // Symmetric algorithm
            IJsonSerializer serializer = new JsonNetSerializer(); // JSON serializer
            IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder(); // Base64Url encoder
            IJwtEncoder encoder = new JwtEncoder(algorithm, serializer, urlEncoder);

            token = encoder.Encode(payload, key); // Assign the generated token to the variable
            Console.WriteLine(token);
        }
        catch (TokenExpiredException)
        {
            Console.WriteLine("Token has expired.");
        }
        catch (SignatureVerificationException)
        {
            Console.WriteLine("Token signature invalid.");
        }
    }
}