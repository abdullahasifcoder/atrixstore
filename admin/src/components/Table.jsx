const Table = ({ data, columns, onEdit, onDelete, actions }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl">
        <div className="text-6xl mb-4 opacity-30">📋</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-500">There are no items to display at the moment.</p>
      </div>
    );
  }

  const getColumnKey = (column, index) => column.key || column.header || `col-${index}`;
  const getColumnLabel = (column) => column.label || column.header || '';

  const hasActions = onEdit || onDelete || actions;

  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="table min-w-full">
          <thead className="table-header bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={getColumnKey(column, index)} 
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {getColumnLabel(column)}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="table-body bg-white divide-y divide-gray-100">
            {data.map((item, rowIndex) => (
              <tr key={item.id || rowIndex} className="table-row hover:bg-indigo-50/30 transition-colors duration-150">
                {columns.map((column, colIndex) => (
                  <td key={getColumnKey(column, colIndex)} className="table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className="table-cell px-6 py-4 whitespace-nowrap text-sm">
                    {actions ? (
                      actions(item)
                    ) : (
                      <div className="flex space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium border border-indigo-100"
                          >
                            ✏️ Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-colors text-sm font-medium border border-rose-100"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600">
        Showing {data.length} {data.length === 1 ? 'item' : 'items'}
      </div>
    </div>
  );
};

export default Table;