const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace showSettingsModal with currentView
code = code.replace(
    'const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);',
    "const [currentView, setCurrentView] = useState<'stream' | 'settings'>('stream');"
);

// Replace toggle rendering
const oldToggle = `<div className="flex bg-brand-paper/50 rounded-full p-1 border border-brand-ink/10 mb-6 shadow-sm mx-auto max-w-sm w-full">
          <button 
            onClick={handleDisablePush}
            className={\`flex-1 flex items-center justify-center py-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-full transition-all \${(!pushEnabled && !showSettingsModal) ? 'bg-brand-ink text-white shadow-md font-semibold' : 'text-brand-ink/60 hover:bg-white/60'}\`}
          >
            Notiser av
          </button>
          <button 
            onClick={() => setShowSettingsModal(true)}
            className={\`flex-1 flex items-center justify-center py-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-full transition-all \${showSettingsModal ? 'bg-brand-ink text-white shadow-md font-semibold' : 'text-brand-ink/60 hover:bg-white/60'}\`}
          >
            Anpassa
          </button>
          <button 
            onClick={handleEnablePush}
            className={\`flex-1 flex items-center justify-center py-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-full transition-all \${(pushEnabled && !showSettingsModal) ? 'bg-brand-accent text-white shadow-md font-semibold' : 'text-brand-ink/60 hover:bg-white/60'}\`}
          >
            Notiser på
          </button>
        </div>`;

const newToggle = `<div className="flex bg-brand-paper/50 rounded-full p-1 border border-brand-ink/10 mb-6 shadow-sm mx-auto max-w-[400px] w-full">
          <button 
            onClick={() => { handleDisablePush(); setCurrentView('stream'); }}
            className={\`flex-1 flex items-center justify-center py-2.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-full transition-all \${(!pushEnabled && currentView !== 'settings') ? 'bg-brand-ink text-white shadow-md font-semibold' : 'text-brand-ink/60 hover:bg-white/60'}\`}
          >
            Notiser av
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={\`flex-1 flex items-center justify-center py-2.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-full transition-all \${(currentView === 'settings') ? 'bg-brand-ink text-white shadow-md font-semibold' : 'text-brand-ink/60 hover:bg-white/60'}\`}
          >
            Anpassa
          </button>
          <button 
            onClick={() => { handleEnablePush(); setCurrentView('stream'); }}
            className={\`flex-1 flex items-center justify-center py-2.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-full transition-all \${(pushEnabled && currentView !== 'settings') ? 'bg-brand-accent text-white shadow-md font-semibold' : 'text-brand-ink/60 hover:bg-white/60'}\`}
          >
            Notiser på
          </button>
        </div>`;

code = code.replace(oldToggle, newToggle);

const oldViews = `{showSettingsModal && (
                <div className="fixed inset-0 bg-brand-ink/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto relative shadow-xl">
                    <button 
                      onClick={() => setShowSettingsModal(false)}
                      className="absolute top-4 right-4 text-brand-ink/50 hover:text-brand-ink p-2 rounded-full hover:bg-brand-paper transition-colors"
                    >
                      <X size={20} />
                    </button>
                    <div className="p-6">
                      <OnboardingWizard
                        onSave={(tags) => {
                          handleSaveTags(tags);
                          setShowSettingsModal(false);
                        }}
                        savedTags={savedTags}
                        pushEnabled={pushEnabled}
                        onEnablePush={handleEnablePush}
                        onDisablePush={handleDisablePush}
                        uiLanguage={uiLanguage || "sv"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "stream" && (
                <ActiveStream
                  onSelectAlert={(id) => navigateTo(\`/larm/\${id}\`)}
                  uiLanguage={uiLanguage || "sv"}
                  savedTags={savedTags}
                  onStreamCountChange={handleStreamCountChange}
                  inlineCreate={false}
                />
              )}

              {activeTab === "create" && (
                <ActiveStream
                  onSelectAlert={(id) => navigateTo(\`/larm/\${id}\`)}
                  uiLanguage={uiLanguage || "sv"}
                  savedTags={savedTags}
                  onStreamCountChange={handleStreamCountChange}
                  inlineCreate={true}
                />
              )}`;

const newViews = `{currentView === 'settings' && (
                <div className="bg-white rounded-3xl w-full p-6 shadow-sm border border-brand-ink/5">
                  <OnboardingWizard
                    onSave={(tags) => {
                      handleSaveTags(tags);
                      setCurrentView('stream');
                    }}
                    savedTags={savedTags}
                    pushEnabled={pushEnabled}
                    onEnablePush={handleEnablePush}
                    onDisablePush={handleDisablePush}
                    uiLanguage={uiLanguage || "sv"}
                  />
                </div>
              )}

              {currentView === 'stream' && activeTab === "stream" && (
                <ActiveStream
                  onSelectAlert={(id) => navigateTo(\`/larm/\${id}\`)}
                  uiLanguage={uiLanguage || "sv"}
                  savedTags={savedTags}
                  onStreamCountChange={handleStreamCountChange}
                  inlineCreate={false}
                />
              )}

              {currentView === 'stream' && activeTab === "create" && (
                <ActiveStream
                  onSelectAlert={(id) => navigateTo(\`/larm/\${id}\`)}
                  uiLanguage={uiLanguage || "sv"}
                  savedTags={savedTags}
                  onStreamCountChange={handleStreamCountChange}
                  inlineCreate={true}
                />
              )}`;

code = code.replace(oldViews, newViews);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx updated");
