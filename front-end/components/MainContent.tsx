export default function MainContent() {
  return (
    <main className="w-full lg:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-3xl font-bold mb-4">Introduction to Neural Networks</h2>
      <p className="mb-4">
        Neural networks are a set of algorithms, modeled loosely after the human brain, that are designed to recognize patterns. They interpret sensory data through a kind of machine perception, labeling or clustering raw input.
      </p>
      <h3 className="text-2xl font-semibold mb-3">Key Components</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Input Layer</li>
        <li>Hidden Layers</li>
        <li>Output Layer</li>
        <li>Weights and Biases</li>
        <li>Activation Functions</li>
      </ul>
      <p className="mb-4">
        These components work together to process input data and produce meaningful output, enabling neural networks to perform complex tasks such as image recognition, natural language processing, and more.
      </p>
      <img 
        src="/placeholder.svg?height=300&width=500" 
        alt="Neural Network Architecture" 
        className="w-full h-auto rounded-lg shadow-md mb-4"
      />
      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
        Figure 1: Basic architecture of a neural network
      </p>
    </main>
  )
}

