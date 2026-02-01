import shutil
import os
from datetime import datetime

def backup_database(backup_dir: str = "backups") -> str:
    """Backup the SQLite database"""
    os.makedirs(backup_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"portfolio_backup_{timestamp}.db"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    shutil.copy2("portfolio.db", backup_path)
    return backup_path

def restore_database(backup_path: str) -> bool:
    """Restore database from backup"""
    try:
        if not os.path.exists(backup_path):
            return False
        
        # Backup current database
        if os.path.exists("portfolio.db"):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            shutil.copy2("portfolio.db", f"portfolio_before_restore_{timestamp}.db")
        
        # Restore from backup
        shutil.copy2(backup_path, "portfolio.db")
        return True
    except Exception as e:
        print(f"Error restoring database: {e}")
        return False

def list_backups(backup_dir: str = "backups") -> list:
    """List all available backups"""
    if not os.path.exists(backup_dir):
        return []
    
    backups = []
    for filename in os.listdir(backup_dir):
        if filename.endswith(".db"):
            filepath = os.path.join(backup_dir, filename)
            stats = os.stat(filepath)
            backups.append({
                "filename": filename,
                "path": filepath,
                "size": stats.st_size,
                "created_at": datetime.fromtimestamp(stats.st_ctime).isoformat()
            })
    
    return sorted(backups, key=lambda x: x["created_at"], reverse=True)
