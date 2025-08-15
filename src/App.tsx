import React, { useState, useRef } from "react";

// Types
interface AnalysisResult {
  query: string;
  interpretation: string;
  data: Array<Record<string, any>>;
  visualization_type: string;
  chart_config?: Record<string, any>;
  reasoning_steps?: string[];
  confidence?: number;
  follow_up_suggestions?: string[];
}

interface FileUploadResponse {
  file_id: string;
  filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  preview: Array<Record<string, any>>;
}

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<FileUploadResponse | null>(null);
  const [connectionString, setConnectionString] = useState<string>("");
  const [dataSource, setDataSource] = useState<"csv" | "db">("csv");
  const [query, setQuery] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- File upload (click) ----
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
      setUploadedFile(file);

      // Demo simulation
      setTimeout(() => {
        const mockData: FileUploadResponse = {
          file_id: "demo_file_123",
          filename: file.name,
          rows: 1000,
          columns: 5,
          column_names: ["ID", "Name", "Revenue", "Date", "Category"],
          preview: [
            { ID: 1, Name: "Product A", Revenue: 15000, Date: "2024-01-15", Category: "Electronics" },
            { ID: 2, Name: "Product B", Revenue: 22000, Date: "2024-01-20", Category: "Clothing" }
          ]
        };
        setFileData(mockData);
      }, 500);
    } else {
      alert("Please upload a CSV file");
    }
  };

  // ---- Drag & Drop ----
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
      setUploadedFile(file);

      // Demo simulation
      setTimeout(() => {
        const mockData: FileUploadResponse = {
          file_id: "demo_file_456",
          filename: file.name,
          rows: 1500,
          columns: 6,
          column_names: ["ID", "Customer", "Sales", "Region", "Date", "Status"],
          preview: [
            { ID: 1, Customer: "Acme Corp", Sales: 45000, Region: "North", Date: "2024-02-10", Status: "Active" }
          ]
        };
        setFileData(mockData);
      }, 500);
    } else {
      alert("Please upload a CSV file");
    }
  };

  // ---- Analyze ----
  const processAnalysisQuery = async (naturalLanguageQuery: string) => {
    setIsProcessing(true);

    try {
      // Demo simulation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResult: AnalysisResult = {
        query: naturalLanguageQuery,
        interpretation: `Analysis of your query: "${naturalLanguageQuery}". This shows aggregated data based on your request.`,
        data: [
          { Category: "Electronics", Revenue: 150000, Count: 25 },
          { Category: "Clothing", Revenue: 120000, Count: 18 },
          { Category: "Books", Revenue: 85000, Count: 32 },
          { Category: "Home", Revenue: 95000, Count: 15 },
          { Category: "Sports", Revenue: 110000, Count: 22 }
        ],
        visualization_type: "bar_chart",
        reasoning_steps: [
          "Parsed your natural language query",
          "Identified key metrics and dimensions",
          "Filtered and aggregated the data",
          "Prepared results for visualization"
        ],
        confidence: 0.87,
        follow_up_suggestions: [
          "Show me the trend over the last 6 months",
          "Filter by top performing regions",
          "Compare this data with previous year"
        ]
      };

      setResults(mockResult);
    } catch (error: any) {
      console.error("Analysis failed:", error);
      alert(`Analysis request failed: ${error?.message ?? "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitQuery = () => {
    if (!query.trim()) return;

    if (dataSource === "csv" && !fileData) {
      alert("Please upload a CSV file first");
      return;
    }

    if (dataSource === "db" && !connectionString.trim()) {
      alert("Please provide a database connection string");
      return;
    }

    processAnalysisQuery(query);
  };

  const handleFileInputClick = () => fileInputRef.current?.click();
  const handleExampleQuery = (exampleQuery: string) => setQuery(exampleQuery);

  // ---- Render ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-10">
      <div className="w-full max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium ring-1 ring-blue-100">
            <span>✨</span> AI-assisted analytics
          </div>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Smart Data Analysis
          </h1>
          <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
            Upload your data and ask questions in natural language.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Data Source Panel - Left Side */}
          <div className="xl:col-span-4">
            <div className="rounded-2xl bg-white/90 shadow-lg ring-1 ring-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                🗄 Data source
              </h2>

              {/* Source Type Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setDataSource("csv")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                    dataSource === "csv"
                      ? "bg-white text-blue-600 shadow ring-1 ring-blue-200"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  📄 CSV file
                </button>

                <button
                  onClick={() => setDataSource("db")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition ${
                    dataSource === "db"
                      ? "bg-white text-blue-600 shadow ring-1 ring-blue-200"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  🗃 Database
                </button>
              </div>

              {/* CSV Upload */}
              {dataSource === "csv" && (
                <div className="space-y-4">
                  <div
                    className="group border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer transition hover:border-blue-400 hover:bg-blue-50/40 flex flex-col items-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleFileInputClick}
                  >
                    <div className="mb-3 text-4xl">⬆</div>

                    {uploadedFile ? (
                      <div className="space-y-2">
                        <p className="text-green-700 font-medium text-base">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">Click to change file</p>

                        {fileData && (
                          <div className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-left ring-1 ring-green-100">
                            <p className="text-sm text-green-800 font-medium">
                              📊 {fileData.rows.toLocaleString()} rows · {fileData.columns} columns
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              Columns: {fileData.column_names.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-800 font-medium">
                          Drop CSV here or click to browse
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Up to 100MB • .csv
                        </p>

                        {/* Choose File button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileInputClick();
                          }}
                          className="mt-4 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-md shadow"
                        >
                          Choose File
                        </button>
                      </>
                    )}
                  </div>

                  {/* Hidden input (required for click-to-upload) */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Database Connection */}
              {dataSource === "db" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Connection string
                  </label>
                  <textarea
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                    placeholder={`postgresql://user:password@host:port/database
mysql://user:password@host:port/database
sqlite:///path/to/database.db`}
                    className="w-full rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-800 placeholder-gray-400 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 resize-none"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    Supports PostgreSQL, MySQL, SQLite
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Query Panel - Right Side */}
          <div className="xl:col-span-8">
            <div className="rounded-2xl bg-white/90 shadow-lg ring-1 ring-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                💬 Natural language query
              </h2>

              <div className="space-y-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Ask anything about your data! For example:
• Show me the top 10 customers by revenue
• Create a chart of sales trends over time
• Filter products with inventory below 50
• Group employees by department and show average salary`}
                  className="w-full rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 placeholder-gray-400 shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 resize-none text-base min-h-[160px]"
                  rows={5}
                />

                {/* Analyze button directly below the query box */}
                <div>
                  <button
                    onClick={handleSubmitQuery}
                    disabled={isProcessing || (!fileData && dataSource === "csv") || (!connectionString && dataSource === "db")}
                    className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white text-lg font-semibold shadow-lg transition enabled:hover:shadow-xl enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                  >
                    {isProcessing ? (
                      <>
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing your query...
                      </>
                    ) : (
                      <>📊 Analyze data</>
                    )}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              {results && (
                <div className="mt-10 space-y-6">
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      📊 Analysis results
                    </h3>

                    {/* Interpretation */}
                    <div className="rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100">
                      <p className="text-blue-900">
                        <strong>Interpretation:</strong> {results.interpretation}
                      </p>
                    </div>

                    {/* Confidence Score */}
                    {typeof results.confidence === "number" && (
                      <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100 mt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Confidence score
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {Math.round(results.confidence * 100)}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2.5 rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${results.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Reasoning Steps */}
                    {Array.isArray(results.reasoning_steps) && results.reasoning_steps.length > 0 && (
                      <div className="mt-4 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
                        <h4 className="font-medium text-gray-900 mb-3">🧠 Reasoning steps</h4>
                        <ol className="space-y-2">
                          {results.reasoning_steps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                {index + 1}
                              </span>
                              <span className="text-sm text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Data Results Table */}
                    <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-gray-200">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h4 className="font-medium text-gray-900">📈 Data results</h4>
                      </div>

                      {Array.isArray(results.data) && results.data.length > 0 ? (
                        <div className="overflow-auto max-h-80">
                          <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                              <tr>
                                {Object.keys(results.data[0] ?? {}).map((key) => (
                                  <th
                                    key={key}
                                    className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide"
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                              {results.data.slice(0, 10).map((row, i) => (
                                <tr key={i} className="hover:bg-blue-50/40 transition">
                                  {Object.values(row).map((value, j) => (
                                    <td key={j} className="px-4 py-3 text-gray-900">
                                      {typeof value === "number" ? value.toLocaleString() : String(value)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {results.data.length > 10 && (
                            <div className="px-4 py-3 bg-gray-50 border-t text-center text-xs text-gray-500">
                              Showing first 10 of {results.data.length.toLocaleString()} results
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500 bg-white">
                          No data returned from query
                        </div>
                      )}
                    </div>

                    {/* Follow-up Suggestions */}
                    {Array.isArray(results.follow_up_suggestions) && results.follow_up_suggestions.length > 0 && (
                      <div className="mt-6 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-100">
                        <h4 className="font-medium text-amber-900 mb-3">
                          💡 Suggested next questions
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {results.follow_up_suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleExampleQuery(suggestion)}
                              className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-left text-sm text-amber-900 transition hover:bg-amber-100"
                            >
                              "{suggestion}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Example Queries Section */}
        <div className="rounded-2xl bg-white/90 shadow-lg ring-1 ring-gray-200 p-6 mt-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">💡 Example queries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {[
              "Show me sales by region for the last quarter",
              "Create a bar chart of top 5 products by revenue",
              "Filter customers who haven't purchased in 6 months",
              "Group orders by month and show total value",
              "Find correlations between price and sales volume",
              "Show me outliers in the customer age data"
            ].map((example, i) => (
              <button
                key={i}
                onClick={() => handleExampleQuery(example)}
                className="text-left rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
              >
                <span className="text-blue-500 mr-1">"</span>
                {example}
                <span className="text-blue-500 ml-1">"</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;