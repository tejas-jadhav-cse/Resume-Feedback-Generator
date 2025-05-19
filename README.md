# Resume Feedback Generator

A modern, minimalistic web application that allows users to upload or paste their resume and receive structured, actionable feedback. This fully client-side app uses AI to analyze resumes and provide detailed feedback to help users improve their job application materials.

![Resume Feedback Generator Screenshot](https://placehold.co/600x400?text=Resume+Feedback+Generator)

## Features

- **Drag & Drop PDF Upload**: Easily upload your resume in PDF format
- **Text Paste Option**: Alternatively, paste the plain text of your resume
- **AI-Powered Feedback**: Get detailed, structured feedback on your resume
- **Section-by-Section Analysis**: Receive specific feedback for each section of your resume
- **Score Assessment**: Get a numerical score to understand your resume's overall strength
- **Actionable Suggestions**: Receive concrete improvement recommendations
- **PDF Export**: Export your feedback to PDF for later reference
- **Dark/Light Mode**: Choose your preferred visual theme
- **Mobile Responsive**: Works seamlessly on both desktop and mobile devices
- **Client-Side Only**: No server required, all processing happens in your browser (except OpenAI API calls)

## Technologies Used

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **pdf.js**: PDF parsing library
- **html2pdf.js**: PDF export functionality
- **OpenAI API**: For generating intelligent resume feedback
- **Vite**: Fast build tooling

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resume-feedback-generator.git
   cd resume-feedback-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Usage

1. Upload your resume PDF or paste its text
2. Add your OpenAI API key (or use the mock feedback for testing)
3. Click "Generate Feedback"
4. Review your feedback in the categories provided
5. Export to PDF if desired

## Deployment

This application can be easily deployed to services like Vercel, Netlify, or GitHub Pages:

```bash
npm run build
# or
yarn build
```

The build artifacts will be in the `dist` directory.

## Customization

You can modify the feedback prompts, UI themes, and other aspects of the application by editing the following files:

- `src/utils/openaiUtils.ts`: Modify the AI prompt or adjust mock feedback
- `tailwind.config.js`: Customize the design system colors and other visual aspects
- `src/components/FeedbackCard.tsx`: Change how feedback is displayed

## License

MIT
  },
})
```
