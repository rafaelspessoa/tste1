import React, { useRef } from 'react';
import { Bet } from '@/types';
import { Button } from '@/components/ui/button';
import { GameTypeBadge } from '@/components/shared/GameTypeBadge';
import { 
  Printer, 
  Share2, 
  X, 
  CheckCircle,
  Copy 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface BetReceiptProps {
  bet: Bet;
  onClose: () => void;
}

export function BetReceipt({ bet, onClose }: BetReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bet.codigo);
    toast.success('Código copiado!');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Enviando para impressão...');
  };

  const handleShare = async () => {
    const text = `
🎰 COMPROVANTE DE APOSTA
━━━━━━━━━━━━━━━━━━
Código: ${bet.codigo}
Vendedor: ${bet.vendedor_nome}
Tipo: ${bet.tipo_jogo.charAt(0).toUpperCase() + bet.tipo_jogo.slice(1)}
Número: ${bet.numero}
Valor: R$ ${bet.valor.toFixed(2)}
Data: ${format(new Date(bet.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
━━━━━━━━━━━━━━━━━━
Milhar Pro
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Comprovante de Aposta',
          text,
        });
      } catch {
        navigator.clipboard.writeText(text);
        toast.success('Comprovante copiado!');
      }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Comprovante copiado!');
    }
  };

  return (
    <div className="animate-scale-in max-w-md mx-auto">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Aposta Registrada!</h1>
        <p className="text-muted-foreground mt-1">Comprovante gerado com sucesso</p>
      </div>

      {/* Receipt Card */}
      <div 
        ref={receiptRef}
        className="glass-card rounded-xl overflow-hidden print:shadow-none"
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
              <span className="font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg">Milhar Pro</span>
          </div>
          <p className="text-sm opacity-80">Comprovante de Aposta</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Code */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">CÓDIGO</p>
            <button 
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 font-mono text-2xl font-bold text-foreground hover:text-accent transition-colors"
            >
              {bet.codigo}
              <Copy className="w-4 h-4 opacity-50" />
            </button>
          </div>

          <div className="border-t border-dashed border-border pt-4 space-y-3">
            {/* Seller */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendedor</span>
              <span className="font-medium text-foreground">{bet.vendedor_nome}</span>
            </div>

            {/* Game Type */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tipo de Jogo</span>
              <GameTypeBadge type={bet.tipo_jogo} size="sm" />
            </div>

            {/* Number */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Número</span>
              <span className="font-mono text-2xl font-bold text-primary">{bet.numero}</span>
            </div>

            {/* Value */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Valor</span>
              <span className="font-bold text-xl text-accent">
                {bet.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>

            {/* Date */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data/Hora</span>
              <span className="font-medium text-foreground">
                {format(new Date(bet.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-dashed border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Guarde este comprovante para conferência
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handlePrint}
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      <Button 
        variant="accent" 
        size="lg"
        className="w-full mt-3"
        onClick={onClose}
      >
        Nova Aposta
      </Button>
    </div>
  );
}
