# CHARAK API - Advanced Medical Coding System

A comprehensive medical coding system website that bridges traditional Ayurvedic medicine with modern healthcare standards.

## 🚀 Features

### **Complete RESTful API Backend**
- **Express.js API Server** with comprehensive endpoints
- **SQLite Database** with Prisma ORM for type-safe queries
- **JWT Authentication** for secure user sessions
- **Automatic API Logging** for usage tracking and analytics
- **RESTful Architecture** following best practices
- **Comprehensive Error Handling** with detailed error messages

### **Professional Medical Design System**
- Sophisticated green (#158 43% 40%) and orange accent (#25 85% 53%) color scheme
- Comprehensive HSL-based design tokens for theming
- Professional medical styling with shadows, gradients, and custom CSS classes
- Dark/light mode support with semantic color tokens

### **Authentication & Role-Based Access**
- Login page with demo credentials:
  - **Doctor**: `demodoctor` / `123`
  - **Government**: `GovAgent` / `123`
- Role-based routing: doctors see medical search interface, government sees analytics dashboard

### **Doctor Interface (Medical Search)**
- **Patient Context**: ABHA ID input for medical history retrieval
- **Intelligent Search**: Real-time disorder search with bidirectional English/Sanskrit term matching
- **Smart Suggestions**: Auto-complete with ICD-11 and NAMASTE code mapping
- **ABHA Consent Modal**: Simulated patient consent workflow for medical record updates
- **Patient History**: Display previous visits with dual coding system
- **Session Diagnoses**: Track current session diagnoses with generate handout options

### **Government Analytics Dashboard**
- **Disease Analytics Search**: Search-triggered detailed modals with regional/seasonal trends
- **Vata Imbalance Reports**: Interactive bar charts showing problem severity across Indian states
- **Anonymized Trend Data**: Sortable tables with disorder categories, regions, trends, and age groups
- **EMR Usage Breakdown**: Progress bars showing public/private/Ayush center adoption rates

### **Developer Portal**
- **API Documentation**: Complete with authentication, endpoints, and parameters
- **Multi-language Code Examples**: JavaScript, Python, and Java integration snippets
- **Copy-to-clipboard functionality** for all code samples
- **Syntax highlighting** for better code readability
- **RESTful API specifications** with proper endpoint documentation

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js + TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with comprehensive design system
- **State Management**: React Context for authentication and session data
- **UI Components**: Custom medical-themed components
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualizations

## 🏗️ API Architecture

The CHARAK API provides a complete backend system with the following endpoints:

### Core API Endpoints:
- **Authentication**: `/api/auth/login` - JWT-based authentication
- **Disorders**: CRUD operations and intelligent search
  - Search, filter by category, get by ID or code (ICD-11/NAMASTE)
- **Patients**: Full patient management
  - Search, ABHA ID lookup, create/update, medical history
- **Diagnoses**: Diagnosis management
  - Create, read, update diagnoses with consent tracking
- **Analytics**: Comprehensive reporting
  - Trend analysis, EMR usage stats, disease analytics, dashboards

### API Features:
- **Automatic Request Logging**: All API calls are logged for analytics
- **Error Handling**: Consistent error responses across all endpoints
- **Type Safety**: Full TypeScript support with Prisma Client
- **Query Optimization**: Efficient database queries with Prisma
- **Flexible Filtering**: Support for search, pagination, and filtering

📖 **[Complete API Documentation](./API_DOCUMENTATION.md)**

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd charak-api
   ```

2. **Install and setup everything**
   ```bash
   npm run setup
   ```
   This will:
   - Install all dependencies
   - Generate Prisma client
   - Create database schema
   - Seed demo data

3. **Start the complete system**
   
   **Option 1: Start API and Frontend together**
   ```bash
   npm run start:all
   ```
   
   **Option 2: Start them separately**
   
   Terminal 1 - Start API server:
   ```bash
   npm run server
   # API will run on http://localhost:3001
   ```
   
   Terminal 2 - Start frontend:
   ```bash
   npm run dev
   # Frontend will run on http://localhost:5173
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - API: http://localhost:3001
   - API Health Check: http://localhost:3001/api/health

### Manual Setup (Step by Step)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd charak-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Create database and tables
   npx prisma db push
   
   # Seed with demo data
   npx tsx prisma/seed.ts
   ```

4. **Start API server**
   ```bash
   npm run server
   # or for auto-reload during development
   npm run server:dev
   ```

5. **Start frontend (in a new terminal)**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Database

The application uses **SQLite** with **Prisma ORM** for easy setup and robust data management:

- **SQLite Database**: Zero-configuration, file-based database (`prisma/dev.db`)
- **Prisma ORM**: Type-safe database access with auto-generated client
- **Pre-seeded Data**: Includes demo users, medical disorders, patients, and analytics
- **Full Schema**: Users, disorders, patients, diagnoses, analytics, and EMR usage tracking

## 🎯 Demo Credentials

### Doctor Login
- **Username**: `demodoctor`
- **Password**: `123`
- **Access**: Medical search interface, patient management, ABHA integration

### Government Login
- **Username**: `GovAgent`
- **Password**: `123`
- **Access**: Analytics dashboard, disease trends, EMR usage reports

## 🏥 Key Components

### **Dual Coding System Integration**
- Bidirectional search between English and Sanskrit medical terms
- ICD-11 and NAMASTE code mapping and display
- Confidence scoring for disorder matches
- Traditional Ayurvedic terminology support

### **Professional UI/UX**
- Medical-themed cards and interface elements
- Interactive charts and data visualizations
- Modal dialogs for consent workflows and detailed analytics
- Responsive grid layouts for different screen sizes

### **SEO & Meta Tags**
- Optimized title: "CHARAK API - Advanced Medical Coding System"
- Professional description for medical coding and healthcare APIs
- Open Graph and Twitter card integration
- Medical coding and healthcare API keyword optimization

## 📚 Available Scripts

### Development
- `npm run dev` - Start frontend development server (port 5173)
- `npm run server` - Start API backend server (port 3001)
- `npm run server:dev` - Start API with auto-reload on changes
- `npm run start:all` - Start both API and frontend together

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database (caution: deletes all data)

### Build & Test
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test:db` - Test database connection
- `npm run health-check` - Check API health status

### Setup
- `npm run setup` - Complete setup (install + db setup + seed)

## 🎨 Design System

### **Color Palette**
- **Primary Medical**: `hsl(158, 43%, 40%)`
- **Accent Orange**: `hsl(25, 85%, 53%)`
- **Light Background**: `hsl(158, 43%, 95%)`
- **Dark Text**: `hsl(158, 43%, 20%)`

### **Custom CSS Classes**
- `.medical-card` - Professional card styling
- `.medical-button-primary` - Primary action buttons
- `.medical-search-input` - Search input fields
- `.glass-effect` - Glass morphism effects

## 🔧 Development Guidelines

### **Component Structure**
```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── context/            # React Context providers
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind
```

### **Adding New Features**
1. Create components in appropriate directories
2. Follow TypeScript best practices
3. Use medical design system classes
4. Implement responsive design
5. Add proper error handling

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel: `npm i -g vercel && vercel`
   - Netlify: Drag `dist` folder to Netlify
   - GitHub Pages: Use GitHub Actions

## 📖 API Integration

The application includes comprehensive API documentation with:
- Complete endpoint specifications
- Request/response examples
- Multi-language code samples (JavaScript, Python, cURL)
- Authentication flow
- Error handling guidelines
- Best practices for production use

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

### Quick API Examples:

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demodoctor","password":"123"}'
```

**Search Disorders:**
```bash
curl "http://localhost:3001/api/disorders/search?query=fever"
```

**Get Patient by ABHA ID:**
```bash
curl "http://localhost:3001/api/patients/abha/12345678901234"
```

## 🏥 Database Schema

The application uses a comprehensive medical database schema:

- **Users**: Authentication and role management (Doctor, Government, Admin)
- **Patients**: Patient demographics and ABHA integration
- **Disorders**: Medical conditions with dual coding (ICD-11 + NAMASTE)
- **Diagnoses**: Medical diagnoses with consent tracking
- **Analytics**: Anonymized health data for reporting
- **EMR Usage**: System adoption tracking
- **API Usage**: Request logging and analytics

All data is stored in SQLite with Prisma ORM for type-safe queries.

## 🎯 Future Enhancements

- Real backend API integration
- Advanced analytics and reporting
- Mobile application development
- Multi-language support
- Advanced search algorithms
- Integration with actual healthcare systems

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact:
- Email: support@charak-api.com
- Documentation: See API docs within the application
- Issues: Create an issue on GitHub

---

**CHARAK API** - Bridging traditional Ayurvedic medicine with modern healthcare standards through intelligent medical coding.