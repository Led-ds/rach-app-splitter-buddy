
export const expenseFormTemplate = `
  <div class="expense-form-container space-y-4">
    <div class="form-group">
      <label for="description" class="block text-sm font-medium text-gray-700">Descrição</label>
      <input 
        type="text" 
        id="description" 
        placeholder="Ex: Jantar com a equipe" 
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <div id="suggestions-container" class="flex gap-2 mt-2 hidden">
        <!-- Suggestions will be rendered here -->
      </div>
    </div>

    <div class="form-group">
      <label for="amount" class="block text-sm font-medium text-gray-700">Valor</label>
      <input 
        type="number" 
        id="amount" 
        placeholder="Ex: 50.00" 
        step="0.01"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div class="form-group">
      <label for="paidBy" class="block text-sm font-medium text-gray-700">Pago por</label>
      <select 
        id="paidBy" 
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Selecione...</option>
        <!-- People options will be rendered here -->
      </select>
    </div>

    <div class="form-group">
      <label for="category" class="block text-sm font-medium text-gray-700">Categoria</label>
      <select 
        id="category" 
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="Comida">Comida</option>
        <option value="Transporte">Transporte</option>
        <option value="Hospedagem">Hospedagem</option>
        <option value="Entretenimento">Entretenimento</option>
        <option value="Outros">Outros</option>
      </select>
    </div>

    <div class="form-group">
      <label for="date" class="block text-sm font-medium text-gray-700">Data</label>
      <input 
        type="date" 
        id="date" 
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <button 
      id="add-expense-btn" 
      class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
    >
      Adicionar Gasto
    </button>
  </div>
`;

export const suggestionTemplate = (suggestion: string) => `
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors" 
        data-suggestion="${suggestion}">
    ${suggestion}
  </span>
`;
