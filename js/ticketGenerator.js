
// generate the ticket page
export function ticketDisplay() {
const savedData = localStorage.getItem("user");
    if (!savedData) {
        console.error("No user data found in localStorage");
        return;
    }
    try {
        const userData = JSON.parse(savedData);
        const values = Object.values(userData);
        // Get current date
        const currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        // Get location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        const city = data.address.city || data.address.town || "Unknown City";
                        const country = data.address.country || "Unknown Country";
                        generateTicketContent(values, currentDate, city, country);
                    } catch (error) {
                        console.error("Error fetching location:", error);
                        generateTicketContent(values, currentDate, "Unknown City", "Unknown Country");
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error.message);
                    generateTicketContent(values, currentDate, "Unknown City", "Unknown Country");
                }
            );
        } else {
            console.log("Geolocation not supported");
            generateTicketContent(values, currentDate, "Unknown City", "Unknown Country");
        }
    } catch (error) {
        console.error("Error parsing user data:", error);
    }
}
function generateTicketContent(values, date, city, country) {
    const ticketContent = `
    <!-- ticketHeader -->
    <div class="ticketHeader">
        <!-- head-p1 -->
        <div class="headerPartOne">
            <img src="assets/images/logo-full.svg" alt="CodingConfImg">
        </div>
        <!-- head-p2 -->
        <div class="headerPartTwo">
            <span>
                Congrats, <span id="UsernameText" > ${values[1]}! </span>Your ticket is ready.
            </span>
        </div>
        <!-- head-p3 -->
        <div class="headerPartThree" >
            <p id="emailSentText">
                <span>We've emailed your ticket to </span>
                <span class="line">
                    <span id="UserEmailText" >${values[2]}</span> and will send updates in 
                    the run to event
                </span>
            </p>
        </div>
        </div>
        <!-- finalTicket -->
        <div class="ticketContainer">
            <div class="ticket">
            <!-- ticketGeneratedDate -->
            <div class="ticketHeadContainer">
                <div class="imgContainer">
                    <img src="assets/images/logo-full.svg" alt="CodingConfImg">
                </div>
                <div class="dateAndLocationContainer">
                    <span class="date">${date}</span>
                    /
                    <span class="location">${city}, ${country}</span>
                </div>
            </div>
            <!-- ticketSerialNumber -->
            <div class="serialNumberContainer">
                <span class="serialNumber">#01609</span>
            </div>
            <!-- UserInfoOnTicket -->
            <div class="userInfoContainer">
                <div class="userImgContainer">
                    <img src="${values[0]}" alt="UserImg">
                </div>
                <div class="userName-UserGitHub">
                <!-- username -->
                <div class="userNameContainer">
                    <span>${values[1]}</span>
                </div>
                <!-- gitHubId -->
                <div class="userGitHubContainer">
                    <img src="./assets/images/icon-github.svg" alt="GitHub">
                    <span>${values[3]}</span>
                </div>
                </div>
            </div>
        </div>
    </div>
    `;
    const container = document.querySelector("main");
    if (container) {
        container.innerHTML = ticketContent;
    } else {
        console.error("Ticket container element not found");
    }
}
