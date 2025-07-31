# SmartQuote - Website Development Quotation Generator

A complete frontend-only responsive web application built for freelancers and small web development agencies to generate intelligent website development quotations for clients.

## 🎯 Features

- **Manual Quotation Creation**: Create detailed quotations by specifying page complexity, features, and requirements
- **Figma Auto-Suggest**: Upload Figma files for intelligent pricing suggestions based on design analysis
- **Dynamic Pricing**: Easily configurable pricing structure stored in JSON format
- **Export Options**: Export quotations as PDF or JSON for easy sharing with clients
- **Responsive Design**: Fully responsive interface that works on all devices
- **Real-time Calculations**: Live pricing updates as you modify quotation parameters

## 🛠️ Tech Stack

- **React.js 18** - Frontend framework
- **TailwindCSS 3** - Utility-first CSS framework
- **React Router** - Client-side routing
- **jsPDF & html2canvas** - PDF export functionality
- **JSON Configuration** - Editable pricing structure

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smartquote
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   └── Layout.js          # Main layout with navigation
├── pages/
│   ├── Home.js           # Dashboard/Home page
│   ├── ManualQuotation.js # Manual quotation creation
│   ├── AutoSuggest.js    # Figma upload and analysis
│   ├── QuotationPreview.js # Quotation preview and export
│   └── Settings.js       # Pricing configuration
├── pricing.json          # Editable pricing configuration
├── index.css            # Global styles and Tailwind imports
├── App.js               # Main app component with routing
└── index.js             # Application entry point
```

## 💰 Pricing Configuration

The application uses a JSON-based pricing system that can be easily modified:

### Default Pricing Structure

```json
{
  "tiers": {
    "simple": 1500,     // Basic pages with minimal functionality
    "standard": 3000,   // Medium complexity with forms and interactions
    "advanced": 6000    // Complex pages with advanced features
  },
  "modifiers": {
    "animation": 300,        // Cost per animation element
    "api": 800,             // Cost per API integration
    "long_page": 500,       // Additional cost for long scrolling pages
    "reused_component": -200 // Discount per reused component
  },
  "optional_features": {
    "seo_optimization": 3000, // Complete SEO setup
    "cms_support": 5000,      // Content Management System
    "admin_panel": 8000,      // Custom admin panel
    "hosting_support": 2000   // Hosting setup and deployment
  }
}
```

### Modifying Pricing

You can update pricing in two ways:

1. **Visual Editor**: Use the Settings page interface to modify values
2. **JSON Editor**: Edit the JSON structure directly in the Settings page
3. **File Edit**: Manually edit `src/pricing.json`

## 📱 Pages Overview

### 1. Home/Dashboard
- Welcome screen with application overview
- Quick access to main features
- Feature highlights and benefits

### 2. Manual Quotation
- **Page Setup**: Configure number of pages and complexity
- **Page Configuration**: Set tier (Simple/Standard/Advanced) for each page
- **Modifiers**: Add animations, API integrations, and other features
- **Optional Features**: Global project add-ons like SEO, CMS, etc.
- **Real-time Pricing**: Live calculation sidebar

### 3. Figma Auto-Suggest
- **Upload Options**: Support for .fig files or Figma URLs
- **Design Analysis**: Mock AI analysis of design complexity
- **Component Detection**: Automatic page and feature detection
- **Editable Suggestions**: Modify AI suggestions before generating quote

### 4. Quotation Preview
- **Detailed Breakdown**: Comprehensive table of all pages and costs
- **Project Summary**: Overview statistics and totals
- **Export Options**: PDF and JSON export functionality
- **Professional Layout**: Client-ready quotation format

### 5. Settings
- **Visual Editor**: User-friendly interface for pricing updates
- **JSON Editor**: Direct JSON editing with validation
- **Configuration Download**: Export pricing configuration
- **Reset Options**: Restore default values

## 🎨 Design Features

- **Modern UI**: Clean, professional interface using TailwindCSS
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: Comprehensive error messages and validation

## 📊 Export Functionality

### PDF Export
- Professional quotation layout
- Multi-page support for large quotations
- High-quality rendering using html2canvas

### JSON Export
- Complete quotation data structure
- Includes all pricing and configuration details
- Perfect for backup or integration with other systems

## 🔧 Customization

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for theme customization
- All components use TailwindCSS utility classes

### Pricing Logic
- All pricing calculations are in component methods
- Easy to modify formulas and add new features
- Centralized pricing data in JSON format

### Features
- Add new page tiers by updating the pricing JSON
- Create new modifiers with custom calculation logic
- Extend optional features as needed

## 🚀 Deployment

The application is frontend-only and can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your repository for automatic deployments
- **GitHub Pages**: Use the build folder for static hosting
- **AWS S3**: Upload build files to S3 bucket with static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please create an issue in the repository or contact the development team.

## 🔮 Future Enhancements

- **Real Figma Integration**: Connect to Figma API for actual design analysis
- **Client Portal**: Allow clients to view and approve quotations
- **Project Templates**: Save and reuse common project configurations
- **Multi-currency Support**: Support for different currencies
- **Team Collaboration**: Multi-user support with role-based access
- **Analytics Dashboard**: Track quotation success rates and pricing trends

---

Built with ❤️ for the web development community
