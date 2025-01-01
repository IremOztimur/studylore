export default function QuickNotes() {
  return (
    <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-bold mb-4">Quick Notes</h2>
      <ul className="space-y-2">
        <li className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
          Neural networks are inspired by the human brain
        </li>
        <li className="bg-green-100 dark:bg-green-900 p-2 rounded">
          Key components: input layer, hidden layers, output layer
        </li>
        <li className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded">
          Weights and biases are adjusted during training
        </li>
        <li className="bg-pink-100 dark:bg-pink-900 p-2 rounded">
          Activation functions introduce non-linearity
        </li>
      </ul>
    </aside>
  )
}

