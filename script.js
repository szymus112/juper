document.addEventListener('DOMContentLoaded', () => {

    // === KONFIGURACJA ===
    // 
    // WAŻNE! UPEWNIJ SIĘ, ŻE PONIŻSZY ADRES URL JEST POPRAWNY.
    // Wejdź na Discorda, edytuj kanał > Integracje > Webhooki > Skopiuj URL webhooka
    // Stary lub usunięty URL spowoduje, że wysyłanie nie będzie działać.
    // 
    const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1388182270384406660/H6NWxlIMMKnjgfKKooa1cRlcCSxT_hxlNx4u50iQziYc2IgGDWW1NLdR8RWZVvgA127B";

    // === ELEMENTY DOM ===
    const DOMElements = {
        navLinks: document.querySelectorAll('.nav-link'),
        pages: document.querySelectorAll('.page'),
        goToMessagesBtn: document.getElementById('go-to-messages-btn'),
        sendBtn: document.getElementById('send-btn'),
        messageContent: document.getElementById('message-content'),
        postFeed: document.querySelector('.post-feed')
    };

    // === LOGIKA APLIKACJI ===

    const navigation = {
        showPage(pageId) {
            DOMElements.pages.forEach(p => p.classList.remove('active'));
            const newPage = document.getElementById(pageId);
            if (newPage) {
                newPage.classList.add('active');
            }

            DOMElements.navLinks.forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('href') === `#${pageId}`) {
                    l.classList.add('active');
                }
            });
        }
    };

    const feed = {
        addEntry(message, type = 'success') {
            const postElement = document.createElement('div');
            postElement.className = `post ${type}`;

            const content = document.createElement('div');
            content.className = 'post-content';
            content.textContent = message;

            const footer = document.createElement('div');
            footer.className = 'post-footer';
            footer.textContent = new Date().toLocaleString('pl-PL');

            postElement.appendChild(content);
            postElement.appendChild(footer);

            DOMElements.postFeed.prepend(postElement);
            setTimeout(() => {
                postElement.style.opacity = '0';
                setTimeout(() => postElement.remove(), 500);
            }, 15000);
        }
    };

    async function handleSendMessage() {
        const message = DOMElements.messageContent.value.trim();
        if (!message) {
            feed.addEntry("Wiadomość nie może być pusta!", 'error');
            return;
        }

        if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.includes('discord.com')) {
            feed.addEntry("Błąd konfiguracji: URL webhooka jest nieprawidłowy.", 'error');
            return;
        }

        DOMElements.sendBtn.disabled = true;
        DOMElements.sendBtn.textContent = 'Wysyłanie...';

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: "Poczta TeamIdioci",
                    avatar_url: "https://cdn.discordapp.com/attachments/1344031566434926642/1364998806155825243/38ac7d41b804159c49c31f81552eb67e.webp?ex=686015b3&is=685ec433&hm=0f894551075250d1c7edf1a22be8f667ec238fa14ef78ad28e74797e64160d42&",
                    embeds: [{
                        title: "Nowa Wiadomość",
                        description: message,
                        color: 5025616, // Kolor zielony
                        timestamp: new Date().toISOString(),
                        footer: {
                           text: "Wiadomość z Poczty Jupera"
                        }
                    }]
                }),
            });
            
            // Sprawdzenie, czy odpowiedź z Discorda jest OK (status 200-299)
            if (!response.ok) {
                // Jeśli nie, rzucamy błąd z treścią odpowiedzi od Discorda
                const errorData = await response.json();
                throw new Error(`Błąd serwera Discord (${response.status}): ${JSON.stringify(errorData)}`);
            }

            feed.addEntry("Wiadomość została pomyślnie wysłana!");
            DOMElements.messageContent.value = '';

        } catch (error) {
            // POPRAWIONE LOGOWANIE BŁĘDÓW W KONSOLI (F12)
            console.error("Szczegółowy błąd wysyłania na Discord:", error);
            feed.addEntry("Nie udało się wysłać wiadomości. Sprawdź konsolę (F12), aby zobaczyć błędy.", 'error');
        } finally {
            DOMElements.sendBtn.disabled = false;
            DOMElements.sendBtn.textContent = 'Wyślij Anonimowo';
        }
    }


    // === EVENT LISTENERY ===
    DOMElements.navLinks.forEach(l => l.addEventListener('click', (e) => {
        e.preventDefault();
        navigation.showPage(l.getAttribute('href').substring(1));
    }));
    
    // Upewniamy się, że przycisk istnieje, zanim dodamy listener
    if (DOMElements.goToMessagesBtn) {
        DOMElements.goToMessagesBtn.addEventListener('click', () => navigation.showPage('messages'));
    }

    DOMElements.sendBtn.addEventListener('click', handleSendMessage);


    // --- INICJALIZACJA ---
    navigation.showPage('home');
});

// === EVENT LISTENERY ===
