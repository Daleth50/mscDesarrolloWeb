#!/usr/bin/env python3
"""
Script para iniciar desarrollo: Flask + Vite dev server
Ejecutar: python app/scripts/dev.py
"""

import subprocess
import sys
import os
import signal
import time
import threading
from pathlib import Path

# Colores para terminal
class Colors:
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_banner():
    """Mostrar banner de inicio"""
    banner = f"""
{Colors.BOLD}{Colors.BLUE}
╔════════════════════════════════════════╗
║     AppWeb Development Server          ║
║  Flask + Vite (Hot Reload Enabled)     ║
╚════════════════════════════════════════╝
{Colors.RESET}

{Colors.GREEN}✓ Flask backend{Colors.RESET}: http://localhost:5000
{Colors.GREEN}✓ Vite dev server{Colors.RESET}: http://localhost:5173

{Colors.YELLOW}Presiona Ctrl+C para detener{Colors.RESET}
"""
    print(banner)

def run_command(cmd, name, cwd=None):
    """Ejecutar comando en subprocess con salida en tiempo real"""
    print(f"{Colors.BLUE}[{name}]{Colors.RESET} Iniciando...")
    try:
        process = subprocess.Popen(
            cmd,
            shell=True,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            preexec_fn=os.setsid,
        )
        
        # Thread para leer output en background
        def read_output():
            try:
                for line in iter(process.stdout.readline, ''):
                    if line:
                        print(f"{Colors.BLUE}[{name}]{Colors.RESET} {line.rstrip()}")
            except:
                pass
        
        import threading
        t = threading.Thread(target=read_output, daemon=True)
        t.start()
        
        return process
    except Exception as e:
        print(f"{Colors.RED}[{name}] Error: {e}{Colors.RESET}")
        return None

def main():
    # Cambiar al directorio raíz del proyecto
    script_dir = Path(__file__).parent.parent.parent
    os.chdir(script_dir)
    
    print_banner()
    
    processes = []
    
    try:
        # 1. Iniciar Flask (backend)
        flask_process = run_command(
            "python run.py",
            "Flask",
            cwd=script_dir
        )
        if flask_process:
            processes.append(("Flask", flask_process))
            print(f"{Colors.GREEN}✓ Flask iniciado en http://localhost:5000{Colors.RESET}\n")
        
        # Esperar a que Flask esté listo
        time.sleep(2)
        
        # 2. Iniciar Vite dev server (frontend)
        vite_process = run_command(
            "npm run dev",
            "Vite",
            cwd=script_dir
        )
        if vite_process:
            processes.append(("Vite", vite_process))
            print(f"{Colors.GREEN}✓ Vite iniciado en http://localhost:5173{Colors.RESET}\n")
        
        print(f"{Colors.GREEN}{Colors.BOLD}✓ Ambos servidores iniciados exitosamente{Colors.RESET}")
        print(f"{Colors.YELLOW}Abre http://localhost:5173 en tu navegador{Colors.RESET}\n")
        
        # Mantener procesos en ejecución
        while True:
            for name, process in processes:
                if process.poll() is not None:
                    print(f"{Colors.RED}[{name}] proceso terminado inesperadamente{Colors.RESET}")
                    raise KeyboardInterrupt()
            time.sleep(1)
            
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}{Colors.BOLD}⏹ Deteniendo servidores...{Colors.RESET}\n")
        
        # Terminar todos los procesos
        for name, process in processes:
            try:
                os.killpg(os.getpgid(process.pid), signal.SIGTERM)
                print(f"{Colors.YELLOW}[{name}] señal SIGTERM enviada{Colors.RESET}")
            except:
                try:
                    process.terminate()
                except:
                    pass
        
        # Esperar a que terminen
        time.sleep(2)
        
        # Forzar kill si es necesario
        for name, process in processes:
            try:
                if process.poll() is None:
                    os.killpg(os.getpgid(process.pid), signal.SIGKILL)
                    print(f"{Colors.YELLOW}[{name}] forzadamente terminado{Colors.RESET}")
            except:
                try:
                    if process.poll() is None:
                        process.kill()
                except:
                    pass
        
        print(f"\n{Colors.GREEN}{Colors.BOLD}✓ Servidores detenidos{Colors.RESET}\n")
        sys.exit(0)
    except Exception as e:
        print(f"{Colors.RED}Error: {e}{Colors.RESET}")
        sys.exit(1)

if __name__ == "__main__":
    main()
