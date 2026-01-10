import { useState } from 'react';
import { X, CreditCard, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { toast } from 'sonner';

interface PaymentMethodsProps {
  onClose: () => void;
}

export function PaymentMethods({ onClose }: PaymentMethodsProps) {
  const [cards, setCards] = useState([
    { id: 1, last4: '4242', brand: 'Visa', expiry: '12/25', isDefault: true },
    { id: 2, last4: '5555', brand: 'Mastercard', expiry: '08/26', isDefault: false }
  ]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handleAddCard = () => {
    if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv) {
      toast.error('Please fill all fields');
      return;
    }

    const last4 = newCard.number.slice(-4);
    setCards([...cards, {
      id: cards.length + 1,
      last4,
      brand: 'Visa',
      expiry: newCard.expiry,
      isDefault: cards.length === 0
    }]);
    
    setNewCard({ number: '', name: '', expiry: '', cvv: '' });
    setShowAddCard(false);
    toast.success('Card added successfully');
  };

  const handleRemoveCard = (id: number) => {
    setCards(cards.filter(c => c.id !== id));
    toast.success('Card removed');
  };

  const handleSetDefault = (id: number) => {
    setCards(cards.map(c => ({ ...c, isDefault: c.id === id })));
    toast.success('Default payment method updated');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">Payment Methods</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900">{card.brand} •••• {card.last4}</p>
                    <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveCard(card.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              {card.isDefault ? (
                <span className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full">
                  Default
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(card.id)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>

        {!showAddCard ? (
          <Button
            onClick={() => setShowAddCard(true)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 border-0 rounded-2xl h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Payment Method
          </Button>
        ) : (
          <div className="space-y-4 p-5 bg-gray-50 rounded-2xl">
            <h4 className="text-gray-900">Add New Card</h4>
            
            <div>
              <label className="text-sm text-gray-700 mb-2 block">Card Number</label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                maxLength={19}
                className="border-0 bg-white rounded-2xl h-12"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">Cardholder Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                className="border-0 bg-white rounded-2xl h-12"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Expiry</label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  maxLength={5}
                  className="border-0 bg-white rounded-2xl h-12"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-2 block">CVV</label>
                <Input
                  type="text"
                  placeholder="123"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                  maxLength={4}
                  className="border-0 bg-white rounded-2xl h-12"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddCard(false)}
                variant="outline"
                className="flex-1 border-0 bg-white hover:bg-gray-100 rounded-2xl h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCard}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-2xl h-12"
              >
                Add Card
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}



