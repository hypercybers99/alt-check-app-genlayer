class ModalManager {
  private openModals: string[] = [];

  register(id: string): void {
    if (!this.openModals.includes(id)) {
      this.openModals.push(id);
      this.updateRootInert();
    }
  }

  unregister(id: string): void {
    this.openModals = this.openModals.filter((m) => m !== id);
    this.updateRootInert();
  }

  isOpen(id: string): boolean {
    return this.openModals.includes(id);
  }

  hasOpenModals(): boolean {
    return this.openModals.length > 0;
  }

  private updateRootInert(): void {
    const root = document.getElementById("root");
    if (!root) return;

    if (this.openModals.length > 0) {
      root.setAttribute("inert", "");
      document.body.style.overflow = "hidden";
    } else {
      root.removeAttribute("inert");
      document.body.style.overflow = "";
    }
  }
}

export const modalManager = new ModalManager();
