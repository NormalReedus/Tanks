# Tanks (*TBD*)
A recreation of the flash game Tank Trouble

Guidelines
----------
- Hent 'Better Comments' af *Aaron Bond* til VSCode for bedre at kunne følge med i todos, fejl m.m. følgende tegn indsættes som det første i en kommentars linje, for at tilføje farve
	- Sæt '`*`' for at markere noget vigtigt
	- Sæt '`!`' for at markere noget, der skal slettes eller som ikke virker endnu
	- Sæt '`?`' for at markere, at der måske skal kigges nærmere eller genovervejes el. lign.
	- Skriv '`TODO: `' for at henvise til noget, der mangler at blive gjort
	- Skriv '`@param XXX`' efterfulgt af tekst, for at beskrive et bestemt parameter til en funktion
	- Skriv '`//`' inde i kommentaren for at overstrege
	- Eks: `//! Not working yet. Fix before testing` - Laver kommentaren **rød**, så den lettere ses
- Brug *ikke* semikolon i slutningen af linjer; kun ved flere single line statements (det er bare en personlig præference, men vil gerne have det uniformt)
- Prøv så vidt muligt *kun* at holde kode, hvor det passer. Dvs:
	- Brug filerne til at organisere
		- **helpers.js**: Generiske hjælpemetoder (forkortelser, ikke spilrelaterede handlinger etc.)
		- **config.js**: Alle spilindstillinger eller ting man sikkert gerne vil tweake, når spillet engang er bygget
			- Opret props i config-objektet til disse indstillinger
			- Brug `config` når det er noget, der kun indlæses af programmet, men aldrig ændres
		- **[class].js**: Spilelementer - *specielt* dem, der skal kunne replikeres
			- Hvis et objekt/spilelement skal interagere med andet eller mutere sig selv, skal det *specielt* være en class method
			- Brug `static` props til at opbevare ting til setup af spillet, i modsætning til: `state` til at opbevare props relevante under spillet
		- **draw.js**: Skal stort set *kun* kalde funktioner, der skal opdatere noget hvert frame (oftest rendering)
		- **effects.js**: Større, globale effekter (som `shake()`). Eventuelt også fremtidige *events*, som ændrer lidt på spillet
		- **preload.js**: Stort set kun til at loade sprites, lydeffekter og andet, der skal være loadet inden spillet starter
		- **setup.js**: Opsætning af spillet, som kun gøres 1 gang
		- **state.js**: Alle de objekter, der skal holdes styr på og lignende
	- Opdel lange scripts i hjælpefunktioner, der så står sit eget sted
	- Hvis en funktion eksempelvis hedder `bounce()`, så sørg for at funktionen kun **bouncer**, og abstrahér underprocesser til en anden funktion, *eller* navngiv funktionen noget andet
- Permanente kommentarer og variabel-/funktionsnavne på engelsk, hvis projektet senere skal deles

Todos
-----
- Sæt max antal spillere (9 med spawndistance på 1 cell)
- En lækker effekt når et projektil kalder `destroy()`, så det ikke bare forsvinder.
- Finde og loade open source lydeffekter til skud (*gud forbyde, at jeg bliver nødt til at optage mundlyde*)
- `Bullet` class skal omskrives til at extende en `Projectile` class i stedet, og så skal fælleskarakteristika med andre våben flyttes dertil
- `Bullet` driller inde i vægge
- Tilføjelse af tilfældige celler, der til tider "brænder" og ikke må passeres
- Tank collisions med hinanden?
- Find et system for helpers - static i classes vs i instances vs globale funktioner
- Menu / status
	- **Vue overhaul til menu / status etc.**
	- Tilføj fejlmeddelelse, hvis ikke alle controls er valgt
	- Sørg for at pause, unpause, end game etc KUN åbner (og lukker) de rette menuer
	- Styling
	- Handlers til knapper / inputs
	- Clearing af felter + graying af brugte controls
	- Feedback på players + controls oprettet?
	- Statusfelter skal kun vise det mest basale, og så give udvidet info ved hover (f.eks. antal selvmord)
	- Settings / modifiers menu til at ændre configs etc.
- giv ID til `Tank`, så den let kan finde sig selv i `state` (eller evt map det med players, da den kender sin egen player)
- Evt. ændr walls til at have de props, der skal bruges for at udregne collisions, så de ikke skal udregnes hver gang
- Tilføj en counter til selvmord, sørg for at et selvmord ikke tæller almindelige kills
- Se på om body + cannon kan tegnes som 1 p5 shape, som kan roteres ved turning
- Rename helpers navne til at give bedre mening
- Tildeling af point i `Game.end()` eller i en funktion, den kalder
- Loops i `draw.js` kan slås sammen. F.eks. kan tanks + projectiles vist lægges ind i projectiles (bare tjek om rækkefølgen tillader det først)
- Brug push og pop i alle show()
- Hvert våben / bullet skal måske selv tjekke collisions i stedet for, at draw loopet tjekker, så draw ikke skal tjekke alle mulige forskellige conditions?


Idéer til pick ups / våben
--------------------------
- Aktivér for at bytte plads, modstanders `direction` randomizes (kan evt give collision issues med vægge)
- Bruger får lov at bruge musen (lol) i 20? sekunder. Kun 1 ad gangen.
- Laser, men med lidt vedvarende beam også, uden tracing
- Nedbryder af væg
- Mortar, der lobbes en fixed afstand (over vægge også)
- Hjemsøgende missil
- Minigun
- Kortere lifetime på projektiler i en stund / flere projektiler
- Portal (skyd 1, aktiver for at sætte. Gentag)
- Sniper - hurtigt projektil med tracing, der ikke bouncer
- Skjold der dækker x grader omkring tank indtil 1 hit
- Mini-ai som hjælper
- Debuff fjenders move-/projektil-speed
- En cooldown på en slags dash som en ability alle har.

Links
-----
- **Collisions**: https://happycoding.io/tutorials/processing/collision-detection
- **P5 reference**: https://p5js.org/reference/
- **Labyrinter**: https://en.wikipedia.org/wiki/Maze_generation_algorithm - Recursive Backtracker
