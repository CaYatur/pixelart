using System;

namespace PixelArtApp
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine("Pixel Art Uygulamasına Hoş Geldiniz!");
            Console.Write("Adınızı girin: ");
            string? ad = Console.ReadLine(); // "?" işaretiyle nullable olarak belirtildi
            Console.WriteLine($"Merhaba, {ad}! Pixel art uygulamanızı başlatmak için giriş yaptınız.");
            Console.WriteLine("Şimdi burada kullanıcı arayüzü veya diğer işlemleri geliştirebilirsiniz.");
        }
    }
}