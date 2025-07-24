# PowerShell script to start both backend and frontend
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd e:\project\backend; node index.js'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd e:\project\frontend; npm start' 