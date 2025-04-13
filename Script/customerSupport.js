document.addEventListener('DOMContentLoaded', function() {
    const supportData = {
        contacts: [
            { type: "Phone", value: "123-456-7890", icon: "📞" },
            { type: "Email", value: "support@atam.com", icon: "✉️" },
            { type: "Live Chat", value: "Available on website", icon: "💬" }
        ],
        faqs: [
            { question: "How do I track my order?", answer: "Use the tracking link in your confirmation email." },
            { question: "What are your delivery hours?", answer: "Daily from 10 AM to 11 PM." }
        ]
    };

    const content = `
        <div class="support-content">
            <div class="contact-section mb-5">
                <h3 class="mb-3"><i class="bi bi-headset"></i> Contact Options</h3>
                <div class="row">
                    ${supportData.contacts.map(contact => `
                        <div class="col-md-4 mb-3">
                            <div class="contact-card p-3 h-100">
                                <div class="contact-icon mb-2">${contact.icon}</div>
                                <h5>${contact.type}</h5>
                                <p class="mb-0">${contact.value}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="faq-section">
                <h3 class="mb-3"><i class="bi bi-question-circle"></i> Frequently Asked Questions</h3>
                <div class="accordion" id="faqAccordion">
                    ${supportData.faqs.map((faq, index) => `
                        <div class="accordion-item">
                            <h4 class="accordion-header">
                                <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" 
                                        type="button" 
                                        data-bs-toggle="collapse" 
                                        data-bs-target="#faq${index}">
                                    ${faq.question}
                                </button>
                            </h4>
                            <div id="faq${index}" 
                                 class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                                 data-bs-parent="#faqAccordion">
                                <div class="accordion-body">
                                    ${faq.answer}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    const container = document.getElementById('customerSupportContainer');
    if (container) {
        container.innerHTML = content;
    }
});