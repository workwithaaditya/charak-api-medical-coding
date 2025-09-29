# CHARAK API - Advanced Medical Coding System

A comprehensive medical coding system website that bridges traditional Ayurvedic medicine with modern healthcare standards.

## 🚀 Features

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

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with comprehensive design system
- **State Management**: React Context for authentication and session data
- **UI Components**: Custom medical-themed components
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualizations (if needed)

## 📦 Installation & Setup

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
   npx ts-node prisma/seed.ts
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

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
- Authentication examples
- Endpoint specifications
- Multi-language code samples (JavaScript, Python, Java)
- Response format documentation
- Integration best practices

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