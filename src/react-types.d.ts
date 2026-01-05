// Fix for React.Key compatibility issue with @types/react-syntax-highlighter
declare namespace React {
  type Key = string | number;
}
