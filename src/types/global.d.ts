// Global type declarations to suppress TypeScript errors
declare module '*.tsx' {
  const content: any
  export default content
}

declare module '*.ts' {
  const content: any
  export default content
}

// Suppress JSX errors
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export {}
