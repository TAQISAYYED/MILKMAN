
Milkman Management
Full-Stack Dairy Subscription Platform
Django REST Framework  •  React  •  Vite

1. Project Description
Milkman Management is a full-stack web application for managing a dairy subscription service. It provides a clean customer-facing homepage where users can browse and subscribe to fresh dairy products,
and a powerful admin-facing dashboard to manage users, customers, products, categories, and subscriptions — all through a fast React frontend backed by a Django REST API.
The application is designed for small to medium dairy businesses looking to digitise their subscription and delivery operations, replacing manual record-keeping with a
centralised, easy-to-use platform.

3. Features
Customer-Facing
•	Hero landing page with product showcase and call-to-action buttons
•	Browse Fresh Milk, Pure Ghee and Creamy Cheese with live pricing
•	Add products to cart with real-time total calculation
•	Quick Subscribe modal — choose frequency, quantity and start date
•	Mobile-responsive cart drawer for checkout review

Admin Dashboard
•	Users Management — create, edit and delete platform users
•	Customers Management — full customer directory with contact details
•	Products Management — catalogue with categories, pricing and stock levels
•	Categories Management — organise products into dairy categories
•	Subscriptions Dashboard — manage active, paused and inactive subscriptions
•	Real-time stats cards on every page (totals, stock status, subscription counts)
•	Inline slide-down forms — no page navigation required for CRUD operations
•	Consistent warm dairy design system across all pages

3. Tech Stack
Frontend

React
v18+	
Vite
Build tool	
React Router
v6	
Custom CSS
No frameworks

Backend

Django
v4+	
Django REST
Framework	
SQLite
Database	
CORS Headers
django-cors-headers

4. Project Structure
Frontend — src/

Path	Description
src/components/Navbar.jsx	Sticky top navigation with active link highlighting
src/components/Homepage.jsx	Landing page — hero, products, why-us section
src/pages/Users.jsx	Users CRUD management page
src/pages/Customers.jsx	Customer directory with card grid layout
src/pages/Products.jsx	Product catalogue with stock badges
src/pages/Categories.jsx	Category management with card grid
src/pages/Subscriptions.jsx	Subscription dashboard with status badges
src/services/api.js	Centralised API request handler (fetch-based)
src/App.jsx	Route definitions with React Router v6

Backend — project_milkman/

Path	Description
project_milkman/settings.py	Django settings — CORS, installed apps, DB
project_milkman/urls.py	Root URL configuration
*/models.py	Database models for each app
*/serializers.py	DRF serializers for JSON conversion
*/views.py	ViewSets — list, create, update, delete
*/urls.py	App-level URL routing with DefaultRouter

5. Installation Guide
Prerequisites
•	Python 3.10+
•	Node.js 18+
•	pip and npm

Backend Setup

Step 1 — Clone the repository and navigate to the backend:
cd taqi_milkman/backend/project_milkman

Step 2 — Create and activate a virtual environment:
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate        # Mac/Linux

Step 3 — Install dependencies:
pip install django djangorestframework django-cors-headers

Step 4 — Run migrations and create a superuser:
python manage.py migrate
python manage.py createsuperuser

Step 5 — Start the Django server:
python manage.py runserver
Backend will be available at http://127.0.0.1:8000

Frontend Setup

Step 1 — Navigate to the frontend folder:
cd taqi_milkman/frontend

Step 2 — Install dependencies:
npm install

Step 3 — Create a .env file (optional — defaults to localhost):
VITE_API_URL=http://127.0.0.1:8000

Step 4 — Start the development server:
npm run dev
Frontend will be available at http://localhost:5173

6. API Endpoints
Base URL: http://127.0.0.1:8000

Users

Method	Endpoint	Description
GET	/users/	List all users
POST	/users/	Create a new user
PUT	/users/{id}/	Update user by ID
DELETE	/users/{id}/	Delete user by ID

Customers

Method	Endpoint	Description
GET	/customers/	List all customers
POST	/customers/	Create a new customer
PUT	/customers/{id}/	Update customer by ID
DELETE	/customers/{id}/	Delete customer by ID

Products

Method	Endpoint	Description
GET	/products/	List all products
POST	/products/	Create a new product
PUT	/products/{id}/	Update product by ID
DELETE	/products/{id}/	Delete product by ID

Categories

Method	Endpoint	Description
GET	/categories/	List all categories
POST	/categories/	Create a new category
PUT	/categories/{id}/	Update category by ID
DELETE	/categories/{id}/	Delete category by ID

Subscriptions

Method	Endpoint	Description
GET	/subscriptions/	List all subscriptions
POST	/subscriptions/	Create a new subscription
PUT	/subscriptions/{id}/	Update subscription by ID
DELETE	/subscriptions/{id}/	Delete subscription by ID

7. Screenshots
Add screenshots of the following pages to this section:

•	Homepage — hero section with product cards
•	Subscriptions — dashboard with status badges
•	Products — catalogue table with stock indicators
•	Customers — card grid with avatar initials
•	Categories — card grid with left accent border
•	Users — table with avatar initials
Replace this section with actual screenshots from your running application.

8. Future Improvements
•	JWT authentication — protect dashboard routes with login/logout
•	Delivery scheduling — calendar view for daily delivery assignments
•	Payment integration — Razorpay or Stripe for subscription billing
•	SMS/WhatsApp notifications — delivery reminders via Twilio
•	Customer mobile app — React Native companion app
•	Analytics dashboard — revenue charts, churn rate, top products
•	PDF invoice generation — auto-generate monthly bills per customer
•	Multi-vendor support — manage multiple milk suppliers
•	Dark mode — toggle between light cream and dark themes
•	Bulk import — CSV upload for customers and products

