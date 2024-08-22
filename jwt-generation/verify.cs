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
            IJsonSerializer serializer = new JsonNetSerializer();
            IDateTimeProvider provider = new UtcDateTimeProvider();
            IJwtValidator validator = new JwtValidator(serializer, provider);
            IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();

            // Use the same algorithm as used during encoding
            IJwtAlgorithm algorithm = new HMACSHA256Algorithm();
            IJwtDecoder decoder = new JwtDecoder(serializer, validator, urlEncoder, algorithm);

            // Decode the token using the same key
            var json = decoder.Decode(token, "yourSecretKey", verify: true);
            Console.WriteLine(json);
        }
        catch (TokenNotYetValidException)
        {
            Console.WriteLine("Token is not valid yet");
        }
        catch (TokenExpiredException)
        {
            Console.WriteLine("Token has expired");
        }
        catch (SignatureVerificationException)
        {
            Console.WriteLine("Token has an invalid signature");
        }
    }
}