import React, { useRef } from 'react';
import { Bet } from '@/types';
import { Button } from '@/components/ui/button';
import { GameTypeBadge } from '@/components/shared/GameTypeBadge';
import { 
  Printer, 
  Share2, 
  CheckCircle,
  Copy 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface BetReceiptProps {
  bet: Bet;
  allBets?: Bet[];
  onClose: () => void;
}

export function BetReceipt({ bet, allBets, onClose }: BetReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const bets = allBets && allBets.length > 0 ? allBets : [bet];
  const totalValue = bets.reduce((acc, b) => acc + b.valor, 0);
  const isMultiple = bets.length > 1;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado!');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Enviando para impressão...');
  };

  const handleShare = async () => {
    let text = `🎰 COMPROVANTE DE APOSTA\n━━━━━━━━━━━━━━━━━━\n`;
    
    if (isMultiple) {
      text += `Vendedor: ${bet.vendedor_nome}\n`;
      text += `Tipo: ${bet.tipo_jogo.charAt(0).toUpperCase() + bet.tipo_jogo.slice(1)}\n`;
      text += `Data: ${format(new Date(bet.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n\n`;
      text += `NÚMEROS:\n`;
      bets.forEach((b, i) => {
        text += `${i + 1}. ${b.numero} - R$ ${b.valor.toFixed(2)} (${b.codigo})\n`;
      });
      text += `\n━━━━━━━━━━━━━━━━━━\n`;
      text += `TOTAL: R$ ${totalValue.toFixed(2)}\n`;
    } else {
      text += `Código: ${bet.codigo}\n`;
      text += `Vendedor: ${bet.vendedor_nome}\n`;
      text += `Tipo: ${bet.tipo_jogo.charAt(0).toUpperCase() + bet.tipo_jogo.slice(1)}\n`;
      text += `Número: ${bet.numero}\n`;
      text += `Valor: R$ ${bet.valor.toFixed(2)}\n`;
      text += `Data: ${format(new Date(bet.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\n`;
      text += `━━━━━━━━━━━━━━━━━━\n`;
    }
    text += `Milhar Pro`;

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
        <h1 className="text-2xl font-bold text-foreground">
          {isMultiple ? `${bets.length} Apostas Registradas!` : 'Aposta Registrada!'}
        </h1>
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
          {/* Info Header */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendedor</span>
              <span className="font-medium text-foreground">{bet.vendedor_nome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tipo de Jogo</span>
              <GameTypeBadge type={bet.tipo_jogo} size="sm" />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data/Hora</span>
              <span className="font-medium text-foreground">
                {format(new Date(bet.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          </div>

          {/* Numbers List */}
          <div className="border-t border-dashed border-border pt-4">
            <p className="text-xs text-muted-foreground mb-3">
              {isMultiple ? 'NÚMEROS APOSTADOS' : 'NÚMERO APOSTADO'}
            </p>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {bets.map((b, index) => (
                <div 
                  key={b.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {isMultiple && (
                      <span className="text-xs text-muted-foreground w-5">
                        {index + 1}.
                      </span>
                    )}
                    <span className="font-mono text-xl font-bold text-primary">
                      {b.numero}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-accent">
                      R$ {b.valor.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => handleCopyCode(b.codigo)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {b.codigo}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-dashed border-border pt-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">
                {isMultiple ? 'TOTAL' : 'Valor'}
              </span>
              <span className="font-bold text-2xl text-accent">
                {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
