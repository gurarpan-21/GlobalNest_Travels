const prices = {
    "Venice, Italy": 115000, "Santorini, Greece": 98000, "Lucerne, Switzerland": 145000,
    "Reykjavik, Iceland": 125000, "Malé, Maldives": 85000, "Cairo, Egypt": 72000,
    "Cappadocia, Turkey": 89000, "Sydney, Australia": 155000, "Dubai, UAE": 65000,
    "New York, USA": 185000, "Cape Town, SA": 110000, "Rio, Brazil": 130000, "Custom Location": 0
};

let isLoginMode = false;

function checkExistingSession() {
    const activeUser = localStorage.getItem('activeSession');
    const modal = document.getElementById('signin-modal');
    
    if (activeUser) {
        
        const userData = JSON.parse(activeUser);
        applyUserData(userData);
        modal.style.display = 'none';
    } else {
        
        modal.style.display = 'flex';
    }
}

function continueAsGuest() {
    const guestData = {
        name: "Guest Explorer",
        email: "Not Signed In",
        gender: "Traveler",
        isGuest: true
    };
    applyUserData(guestData);
    document.getElementById('signin-modal').style.display = 'none';
    
    alert("Welcome! You are exploring as a Guest.");
}

function toggleAuth() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const desc = document.getElementById('auth-desc');
    const btn = document.getElementById('auth-btn');
    const signupFields = document.getElementById('signup-fields');
    const toggleMsg = document.getElementById('toggle-msg');
    const toggleLink = document.getElementById('toggle-link');

    if (isLoginMode) {
        title.innerText = "Welcome Back";
        desc.innerText = "Please sign in to your account.";
        btn.innerText = "Sign In";
        signupFields.style.display = "none";
        toggleMsg.innerText = "New here?";
        toggleLink.innerText = "Create Account";
    } else {
        title.innerText = "Create Account";
        desc.innerText = "Join GlobalNest Travels today.";
        btn.innerText = "Sign Up";
        signupFields.style.display = "block";
        toggleMsg.innerText = "Already have an account?";
        toggleLink.innerText = "Sign In";
    }
}
function handleAuth() {
    const email = document.getElementById('guest-email').value.trim();
    const pass = document.getElementById('guest-pass').value;

    if (!email || !pass) {
        alert("⚠️ Please fill in all required fields!");
        return;
    }

    const existingUserData = localStorage.getItem(email);

    if (isLoginMode) {
        if (!existingUserData) {
            alert("❌ Account not found!");
            return;
        }

        const user = JSON.parse(existingUserData);
        if (user.password === pass) {
            
            localStorage.setItem('activeSession', JSON.stringify(user)); 
            applyUserData(user);
            document.getElementById('signin-modal').style.display = 'none';
        } else {
            alert("🔑 Invalid Password!");
        }
    } else {
        const name = document.getElementById('guest-name').value.trim();
        const gender = document.getElementById('guest-gender').value;

        if (!name) { alert("⚠️ Enter your Full Name."); return; }
        if (existingUserData) { alert("🚫 Email already registered!"); return; }

        const newUser = { name, email, gender, password: pass };
        localStorage.setItem(email, JSON.stringify(newUser));

        localStorage.setItem('activeSession', JSON.stringify(newUser)); 
        applyUserData(newUser);
        document.getElementById('signin-modal').style.display = 'none';
    }
}

function applyUserData(user) {
    const nameDisplays = document.querySelectorAll('#user-full-name');
    const emailDisplays = document.querySelectorAll('#user-email-display');
    const signinModals = document.querySelectorAll('#signin-modal');

    nameDisplays.forEach(el => {
        el.innerText = user.name || "Guest";
    });

    emailDisplays.forEach(el => {
        el.innerText = user.email || "guest@globalnest.com";
    });

    signinModals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    const hour = new Date().getHours();
    const greetText = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    document.querySelectorAll('#time-greet').forEach(el => el.innerText = greetText);
}

function continueAsGuest() {
    const guestUser = {
        name: "Guest Traveler",
        email: "explorer@globalnest.com",
        gender: "Not Specified"
    };
    
    localStorage.setItem('activeSession', JSON.stringify(guestUser));
    
    applyUserData(guestUser);
    
    document.getElementById('signin-modal').style.display = 'none';
}
window.onload = function() {
    checkExistingSession(); 

    const timeGreet = document.getElementById('time-greet');
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) timeGreet.innerText = "Good Morning";
    else if (hour >= 12 && hour < 18) timeGreet.innerText = "Good Afternoon";
    else timeGreet.innerText = "Good Evening";

    function updatePrice() {
        const dest = document.getElementById('destination-select').value;
        const count = document.getElementById('traveler-count').value;
        const display = document.getElementById('total-amount');
        if (prices[dest] !== undefined) {
            const total = prices[dest] * count;
            display.innerText = dest === "Custom Location" ? "Quote Pending" : "₹" + total.toLocaleString('en-IN');
        }
    }
    document.getElementById('destination-select').addEventListener('change', updatePrice);
    document.getElementById('traveler-count').addEventListener('input', updatePrice);
};

function logout() {

    localStorage.removeItem('activeSession');
    
    alert("You have been logged out successfully.");
    
    location.reload();
}
function searchDestinations() {
    const input = document.getElementById('destination-search').value.toLowerCase();
    const cards = document.getElementsByClassName('card'); 
    let visibleCount = 0;

    for (let i = 0; i < cards.length; i++) {
       
        const title = cards[i].querySelector('h3').innerText.toLowerCase();
        
        if (title.includes(input)) {
            cards[i].style.display = "block";
            visibleCount++;
        } else {
            cards[i].style.display = "none";
        }
    }

    // Update the counter text
    const countDisplay = document.getElementById('search-results-count');
    if (input === "") {
        countDisplay.innerText = "Showing all 12 destinations";
    } else {
        countDisplay.innerText = `Found ${visibleCount} matches for "${input}"`;
    }
}
function toggleMenu() {
    const menu = document.getElementById('nav-links-menu');
    menu.classList.toggle('active');
}
// Ensure this runs on page load
function updateProfileUI(user) {
    const nameTags = document.querySelectorAll('#user-full-name');
    const emailTags = document.querySelectorAll('#user-email-display');
    
    nameTags.forEach(tag => tag.innerText = user.name || "Gurarpan Arora");
    emailTags.forEach(tag => tag.innerText = user.email || "gurarpanarora8thd@gmail.com");
}
