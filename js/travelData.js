const travelData = [
    {
        country: "madeira",
        title: "Madeira",
        description: "Die Landschaftlich schönste Reise bisher.",
        images: ["Madeira_01.JPG", "Madeira_06.JPG", "Madeira_03.jpeg", "Madeira_04.jpeg", "Madeira_04.JPG", "Madeira_05.JPG"],
        stampSymbol: "🌺",
        stampDates: ["AUGUST 2024"],
        distance: "550 km"
    },
    {
        country: "italien",
        title: "Italien",
        description: "Wenn wir jetzt losfahren sind wir in 3h in Italien.",
        images: ["Italy_02.jpeg", "Italy_03.jpeg", "Italy_04.jpeg", "Italy_07.jpeg", "Italy_08.jpeg", "Italy_12.jpeg"],
        stampSymbol: "🍕",
        stampDates: ["AUGUST 2020", "JUNI 2023", "MAI 2024", "MAI 2025", "JULI 2025"],
        distance: "950 km"
    },
    {
        country: "kroatien",
        title: "Kroatien",
        description: "Kristallklares Wasser, historische Altstädte und über 1.000 Inseln an der Adria. Perfekte Strände und kulturelle Schätze.",
        images: ["Kroatien_01.jpeg", "Kroatien_02.jpeg", "Kroatien_09.jpeg", "Kroatien_05.jpeg", "Kroatien_07.jpeg", "Kroatien_11.jpeg"],
        stampSymbol: "🏖️",
        stampDates: ["AUGUST 2020", "AUGUST 2021", "AUGUST 2022", "AUGUST 2023", "MAI 2024"],
        distance: "800 km"
    },
    {
        country: "frankreich",
        title: "Frankreich",
        description: "Von Pariser Charme über provenzalische Landschaften bis zu alpinen Gipfeln. Kulinarische Höhepunkte und atemberaubende Architektur.",
        images: ["France_05.jpeg", "France_08.jpeg", "France_09.jpeg", "France_04.jpeg", "France_03.jpeg", "France_02.jpeg"],
        stampSymbol: "🗼",
        stampDates: ["SEPTEMBER 2022", "JANUAR 2023", "AUGUST 2025"],
        distance: "600 km"
    },
    {
        country: "usa",
        title: "USA",
        description: "Von den Metropolen der Ostküste bis zu den Nationalparks des Westens - Land der unbegrenzten Möglichkeiten.",
        images: ["USA_02.jpeg", "USA_05.jpeg", "USA_06.jpeg", "USA_11.jpeg", "USA_12.jpeg", "USA_07.jpeg"],
        stampSymbol: "🗽",
        stampDates: ["AUGUST 2016", "SEPTEMBER 2023"],
        distance: "7.500 km",
        passportSubtitle: "UNITED STATES"
    },
    {
        country: "kanada",
        title: "Kanada",
        description: "Weite Landschaften, unberührte Natur und die Freundlichkeit der Menschen in den Nationalparks.",
        images: ["Canada_04.jpeg", "Canada_02.jpeg", "Canada_03.jpeg", "Flugzeug_01.jpeg", "Canada_05.jpeg", "Canada_01.jpeg"],
        stampSymbol: "🍁",
        stampDates: ["SEPTEMBER 2023"],
        distance: "6.500 km",
        passportSubtitle: "CANADA"
    },
    {
        country: "china",
        title: "China",
        description: "Modern, sauber, beeindruckend.",
        images: ["China_11.jpeg", "China_13.jpeg", "China_14.jpeg", "China_01.jpeg", "China_06.jpeg", "China_03.jpeg"],
        stampSymbol: "🐉",
        stampDates: ["OKTOBER 2024"],
        distance: "7.800 km",
        passportSubtitle: "PEOPLE'S REPUBLIC"
    }
];

function generateTravelSection() {
    const container = document.getElementById('travelSequence');
    if (!container) return;
    
    let html = '';
    
    travelData.forEach(country => {
        // Country Card
        html += `
            <div class="travel-item">
                <div class="country-card" data-country="${country.country}" data-distance="${country.distance}">
                    <div class="country-header">
                        <h3>${country.title}</h3>
                        ${country.distance ? `<div class="country-distance">${country.distance} von Deutschland</div>` : ''}
                        <p class="country-description">${country.description}</p>
                    </div>
                    <div class="country-gallery">
                        ${country.images.map(img => `<img src="images/${img}" alt="${country.title}">`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="travel-spacer" data-country="${country.country}">
                <div class="passport-container">
                    <div class="passport-cover">
                        <div class="cover-title">PASSPORT</div>
                        <div class="cover-subtitle">${country.passportSubtitle || 'EUROPEAN UNION'}</div>
                    </div>
                    
                    <div class="passport-main-inside">
                        <div class="passport-inside-left">
                            <div class="passport-info-page">
                                <div class="passport-number">T30922A9</div>
                                <div class="passport-name">Passport</div>
                                <div class="passport-photo">PASSPORT<br>PHOTO</div>
                                <div class="passport-details">
                                    <div class="detail-line">
                                        <span class="detail-label">Code:</span> GER
                                    </div>
                                    <div class="detail-line">
                                        <span class="detail-label">Passport No:</span> L9TC5DNG
                                    </div>
                                    <div class="detail-line">
                                        <span class="detail-label">Surname:</span> Barber
                                    </div>
                                    <div class="detail-line">
                                        <span class="detail-label">Given names:</span> Niklas
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="passport-inside-right">
                            <div class="stamp-page">
                                <div style="color: #666; font-size: 1.1rem; margin-bottom: 20px;">
                                    ENTRY STAMPS
                                </div>
                                <div style="color: #999; font-size: 0.9rem; font-style: italic;">
                                    Official entry stamps
                                </div>
                            </div>
                        </div>
                        
                        <div class="passport-stamp">
                            <div class="stamp-inner">
                                <div class="stamp-country">${country.title.toUpperCase()}</div>
                                <div class="stamp-symbol">${country.stampSymbol}</div>
                                ${country.stampDates.map(date => `<div class="stamp-date">${date}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="page-spine"></div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Trigger re-initialization of passport animations
    if (typeof setupPassportAnimations === 'function') {
        setTimeout(setupPassportAnimations, 50);
    }
}

// Generate travel section when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateTravelSection);
} else {
    generateTravelSection();
}
