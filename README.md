# mobile-computing-wise-21

## PRODUCT FINDER

## Projektvision
Die mobile Smartphone App soll es dem Nutzer erleichtern, mit wenig Suchaufwand, das
richtige Produkt bei Amazon zu finden. Bei der Suche durchläuft der Nutzer Iterative Schritte, wo
er Angaben zur Produktkategorie, Produkteigenschaften und Anforderungen angeben kann.

Die App unterstützt den Nutzer bei seiner Produktauswahl und Kaufentscheidung. Das Ergebnis
dieser Suche ist eine Empfehlung für eine überschaubare Anzahl an vorgeschlagenen
Produkten. Wir nutzen die Amazon API, welche die gesamte Datenbank durchsucht und die
entsprechenden Produktbeschreibungen ins Backend lädt. Auf Basis dieser Empfehlung kann
der Nutzer anschließend noch schriftliche Fragen zu dem Produkt stellen. Die OpenAI (GPT-3)
API beantwortet diese Fragen, ebenfalls als Textausgabe.

Eine optionale Erweiterung wäre die Implementierung eines Spracherkennungs-Sensors für die
Suche und eine verbale Ausgabe der Antworten, was die Anwendung für ältere Menschen oder
solche mit einem Handicap vereinfachen würde.

Die App finanziert sich durch Amazon Affiliate-Link Provisionen, wenn Nutzer direkt über die App
ein Produkt kaufen.


## Team-Mitglieder 
* Raphael Sacher
* Jan-Niclas Bracht


## Installation & Usage
1. Klonen Sie das Repository.
   ```
   git clone https://github.com/JanBr113/mobile-computing-wise-21
   ```
2. Öffnen Sie den Ordner `backend` in einer neuen Kommandozeile und installieren Sie alle Abhängigkeiten:

   ```
   cd backend
   npm install
   ```
3. Starten Sie das Backend:
   ```
   npm start
   ```

4. Öffnen Sie den Ordner `frontend` und installieren Sie alle Abhängigkeiten:
   ```
   cd frontend
   npm install
   ```
5. Starten Sie das Frontend:
   ```
   npm start
   ```