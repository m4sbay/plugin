// Fix for React types compatibility with @types/react-syntax-highlighter
declare namespace React {
  type Key = string | number;
  type CSSProperties = Record<string, string | number | undefined>;
  type ComponentType<P = any> = (props: P) => any;
  type ReactNode = any;
  type HTMLProps<T> = Record<string, any>;
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}