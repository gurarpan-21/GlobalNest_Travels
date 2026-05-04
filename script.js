// --- Data and Pricing ---
const prices = {
    "Venice, Italy": 115000, "Santorini, Greece": 98000, "Lucerne, Switzerland": 145000,
    "Reykjavik, Iceland": 125000, "Malé, Maldives": 85000, "Cairo, Egypt": 72000,
    "Cappadocia, Turkey": 89000, "Sydney, Australia": 155000, "Dubai, UAE": 65000,
    "New York, USA": 185000, "Cape Town, SA": 110000, "Rio, Brazil": 130000, "Custom Location": 0
};

let isLoginMode = false;

// --- 1. SESSION PERSISTENCE (Checks if user is already logged in) ---
function checkExistingSession() {
    const activeUser = localStorage.getItem('activeSession');
    const modal = document.getElementById('signin-modal');
    
    if (activeUser) {
        // User is logged in: keep modal hidden and load data
        const userData = JSON.parse(activeUser);
        applyUserData(userData);
        modal.style.display = 'none';
    } else {
        // No user found: Show the modal
        modal.style.display = 'flex';
    }
}

// --- 2. GUEST LOGIC ---
function continueAsGuest() {
    const guestData = {
        name: "Guest Explorer",
        email: "Not Signed In",
        gender: "Traveler",
        isGuest: true
    };
    applyUserData(guestData);
    document.getElementById('signin-modal').style.display = 'none';
    // We don't save 'activeSession' for guests so the popup returns on reload
    alert("Welcome! You are exploring as a Guest.");
}

// --- 3. AUTHENTICATION UI TOGGLE ---
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

// --- 4. CORE AUTH LOGIC (Sign Up / Sign In) ---
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
            // SUCCESSFUL LOGIN: Save the session
            localStorage.setItem('activeSession', JSON.stringify(user)); 
            applyUserData(user);
            document.getElementById('signin-modal').style.display = 'none';
        } else {
            alert("🔑 Invalid Password!");
        }
    } else {
        // SIGN UP LOGIC
        const name = document.getElementById('guest-name').value.trim();
        const gender = document.getElementById('guest-gender').value;

        if (!name) { alert("⚠️ Enter your Full Name."); return; }
        if (existingUserData) { alert("🚫 Email already registered!"); return; }

        const newUser = { name, email, gender, password: pass };
        localStorage.setItem(email, JSON.stringify(newUser));
        
        // AUTO-LOGIN: Save the session
        localStorage.setItem('activeSession', JSON.stringify(newUser)); 
        applyUserData(newUser);
        document.getElementById('signin-modal').style.display = 'none';
    }
}

// --- 5. UI UPDATER ---
function applyUserData(data) {
    document.getElementById('user-full-name').innerText = data.name;
    document.getElementById('user-email-display').innerText = data.email;
    document.getElementById('user-title').innerText = data.gender;
    
    // Fill booking form (if user is not a guest)
    if (data.name !== "Guest Explorer") {
        document.getElementById('user-name').value = data.name;
        document.getElementById('user-email').value = data.email;
    }
}

// --- 6. INITIALIZATION & LIVE CALCULATOR ---
window.onload = function() {
    // Decision happens the millisecond the window loads
    checkExistingSession(); 

    // Time Greeting Logic
    const timeGreet = document.getElementById('time-greet');
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) timeGreet.innerText = "Good Morning";
    else if (hour >= 12 && hour < 18) timeGreet.innerText = "Good Afternoon";
    else timeGreet.innerText = "Good Evening";

    // Pricing Logic
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

// This function clears the session and forces a reload to show the login popup again
function logout() {
    // 1. Remove only the 'activeSession' so the user accounts stay in the database
    localStorage.removeItem('activeSession');
    
    // 2. Alert the user
    alert("You have been logged out successfully.");
    
    // 3. Reload the page to reset the UI and show the Auth Modal
    location.reload();
}
function searchDestinations() {
    const input = document.getElementById('destination-search').value.toLowerCase();
    const cards = document.getElementsByClassName('card'); // Assumes your destination cards use the 'card' class
    let visibleCount = 0;

    for (let i = 0; i < cards.length; i++) {
        // We look for the h3 tag inside each card which contains the city/country name
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