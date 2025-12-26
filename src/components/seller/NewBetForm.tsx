import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBets } from '@/contexts/BetsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GameType } from '@/types';
import { GameTypeBadge } from '@/components/shared/GameTypeBadge';
import { 
  Check, 
  Delete, 
  RotateCcw,
  Receipt 
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { BetReceipt } from './BetReceipt';

const gameTypes: { type: GameType; label: string; digits: number }[] = [
  { type: 'milhar', label: 'Milhar', digits: 4 },
  { type: 'centena', label: 'Centena', digits: 3 },
  { type: 'dezena', label: 'Dezena', digits: 2 },
];

const quickValues = [1, 2, 5, 10, 20, 50];

export function NewBetForm() {
  const { user } = useAuth();
  const { addBet } = useBets();
  
  const [selectedGame, setSelectedGame] = useState<GameType>('milhar');
  const [numero, setNumero] = useState('');
  const [valor, setValor] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastBet, setLastBet] = useState<any>(null);
  
  const numeroInputRef = useRef<HTMLInputElement>(null);

  const selectedGameInfo = gameTypes.find(g => g.type === selectedGame)!;
  const isNumberValid = numero.length === selectedGameInfo.digits && /^\d+$/.test(numero);
  const isValueValid = parseFloat(valor) > 0;
  const canSubmit = isNumberValid && isValueValid;

  useEffect(() => {
    numeroInputRef.current?.focus();
  }, [selectedGame]);

  const handleNumberInput = (digit: string) => {
    if (numero.length < selectedGameInfo.digits) {
      const newNumero = numero + digit;
      setNumero(newNumero);
      
      // Auto-focus value when number is complete
      if (newNumero.length === selectedGameInfo.digits) {
        // Small delay for visual feedback
        setTimeout(() => {
          document.getElementById('valor-input')?.focus();
        }, 100);
      }
    }
  };

  const handleDeleteDigit = () => {
    setNumero(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setNumero('');
    setValor('');
    numeroInputRef.current?.focus();
  };

  const handleQuickValue = (value: number) => {
    setValor(value.toString());
  };

  const handleSubmit = () => {
    if (!canSubmit || !user) return;

    const newBet = addBet({
      vendedor_id: user.id,
      vendedor_nome: user.nome,
      tipo_jogo: selectedGame,
      numero,
      valor: parseFloat(valor),
    });

    setLastBet(newBet);
    setShowReceipt(true);
    
    toast.success('Aposta registrada com sucesso!', {
      description: `${selectedGameInfo.label} - ${numero} - R$ ${valor}`,
    });

    // Reset form
    setNumero('');
    setValor('');
    
    // Focus back to number input after a delay
    setTimeout(() => {
      numeroInputRef.current?.focus();
    }, 300);
  };

  if (showReceipt && lastBet) {
    return (
      <BetReceipt 
        bet={lastBet} 
        onClose={() => setShowReceipt(false)} 
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Nova Aposta</h1>
        <p className="text-muted-foreground mt-1">
          Registre uma nova aposta rapidamente
        </p>
      </div>

      {/* Game Type Selection */}
      <div className="glass-card rounded-xl p-4">
        <Label className="text-sm text-muted-foreground mb-3 block">Tipo de Jogo</Label>
        <div className="grid grid-cols-3 gap-2">
          {gameTypes.map(({ type, label, digits }) => (
            <button
              key={type}
              onClick={() => {
                setSelectedGame(type);
                setNumero('');
              }}
              className={cn(
                "p-3 rounded-lg font-medium transition-all duration-200",
                selectedGame === type
                  ? `game-badge-${type} shadow-lg`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span className="block text-sm">{label}</span>
              <span className="block text-xs opacity-75">{digits} dígitos</span>
            </button>
          ))}
        </div>
      </div>

      {/* Number Display */}
      <div className="glass-card rounded-xl p-6">
        <Label className="text-sm text-muted-foreground mb-3 block">Número Apostado</Label>
        <div className="flex items-center justify-center gap-2 mb-4">
          {Array.from({ length: selectedGameInfo.digits }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "w-14 h-16 md:w-16 md:h-20 rounded-xl flex items-center justify-center",
                "border-2 font-mono text-3xl md:text-4xl font-bold transition-all duration-200",
                numero[idx] 
                  ? "border-accent bg-accent/10 text-foreground" 
                  : "border-border bg-muted text-muted-foreground",
                numero.length === idx && "border-accent animate-pulse-soft"
              )}
            >
              {numero[idx] || '-'}
            </div>
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <Button
              key={digit}
              variant="secondary"
              size="xl"
              className="text-xl font-bold h-14"
              onClick={() => handleNumberInput(digit.toString())}
              disabled={numero.length >= selectedGameInfo.digits}
            >
              {digit}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="xl"
            className="text-xl h-14 text-muted-foreground"
            onClick={handleClear}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            size="xl"
            className="text-xl font-bold h-14"
            onClick={() => handleNumberInput('0')}
            disabled={numero.length >= selectedGameInfo.digits}
          >
            0
          </Button>
          <Button
            variant="ghost"
            size="xl"
            className="text-xl h-14 text-destructive"
            onClick={handleDeleteDigit}
            disabled={numero.length === 0}
          >
            <Delete className="w-5 h-5" />
          </Button>
        </div>

        <input
          ref={numeroInputRef}
          type="text"
          inputMode="numeric"
          value={numero}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, selectedGameInfo.digits);
            setNumero(value);
          }}
          className="sr-only"
          aria-label="Número da aposta"
        />
      </div>

      {/* Value Input */}
      <div className="glass-card rounded-xl p-4">
        <Label className="text-sm text-muted-foreground mb-3 block">Valor da Aposta</Label>
        
        {/* Quick Values */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {quickValues.map((qv) => (
            <Button
              key={qv}
              variant={parseFloat(valor) === qv ? "accent" : "outline"}
              size="sm"
              onClick={() => handleQuickValue(qv)}
              className="font-semibold"
            >
              R${qv}
            </Button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            R$
          </span>
          <Input
            id="valor-input"
            type="number"
            inputMode="decimal"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="0,00"
            className="pl-10 text-xl font-bold h-14 text-center"
            min="0"
            step="0.5"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        variant="accent"
        size="xl"
        className="w-full h-16 text-lg"
        onClick={handleSubmit}
        disabled={!canSubmit}
      >
        <Check className="w-6 h-6 mr-2" />
        Registrar Aposta
      </Button>

      {/* Summary */}
      {canSubmit && (
        <div className="text-center text-muted-foreground animate-fade-in">
          <p>
            <GameTypeBadge type={selectedGame} size="sm" /> • 
            Número <span className="font-mono font-bold text-foreground">{numero}</span> • 
            Valor <span className="font-bold text-foreground">R$ {parseFloat(valor).toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
