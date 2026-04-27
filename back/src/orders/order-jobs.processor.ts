// --- COMENTADO TEMPORALMENTE: Job automático de cambio de estado ---
/*
  @Process()
  async handleOrderStatus(job: Job) {
    const { orderId, currentStatusIndex } = job.data;
    const nextStatusIndex = currentStatusIndex + 1;
    if (nextStatusIndex < STATUS_SEQUENCE.length) {
      const nextStatus = STATUS_SEQUENCE[nextStatusIndex];
      await this.ordersService.updateStatus(orderId, nextStatus);

      // Usa la cola inyectada para re-agendar el siguiente cambio de estado
      await this.orderStatusQueue.add(
        'order-status',
        { orderId, currentStatusIndex: nextStatusIndex },
        { delay: 3 * 60 * 1000 } // 3 minutos
      );
    }
    // Si ya es el último estado, no hace nada más
  }
  */
// --- FIN COMENTADO ---
