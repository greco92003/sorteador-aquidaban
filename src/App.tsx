import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { Button } from "./components/ui/button";
import Confetti from "react-confetti";

const App: React.FC = () => {
  // Inicia o número a sortear com "1"
  const [numToDraw, setNumToDraw] = useState<string>("1");
  const [namesInput, setNamesInput] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [drawTime, setDrawTime] = useState<Date | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Carrega os números do localStorage ou define o valor padrão
  useEffect(() => {
    const savedNames = localStorage.getItem("namesInput");
    const defaultNumbers = "01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 136, 137, 138, 139, 140";
    setNamesInput(savedNames || defaultNumbers);
  }, []);

  // Salva os nomes no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem("namesInput", namesInput);
  }, [namesInput]);

  // Função de embaralhamento (Fisher–Yates)
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleDraw = () => {
    // Converte o valor do input para número
    const k = parseInt(numToDraw);
    // Divide a lista de nomes, remove espaços em branco e filtra entradas vazias
    const namesArray = namesInput
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name !== "");

    // Aborta se não houver nomes ou se o número for inválido ou menor que 1
    if (namesArray.length === 0 || isNaN(k) || k < 1) return;

    setDrawing(true);
    setProgress(0);
    setWinners([]);
    setDrawTime(null);
    setShowConfetti(false);

    // Incrementa a barra de progresso durante 3 segundos (aprox. 30ms por incremento)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    // Após 3 segundos, realiza o sorteio
    setTimeout(() => {
      const shuffled = shuffleArray(namesArray);
      // Se o número solicitado for maior que a quantidade total, seleciona todos em ordem embaralhada
      const selected = k >= shuffled.length ? shuffled : shuffled.slice(0, k);
      setWinners(selected);
      setDrawTime(new Date());
      setDrawing(false);
      setShowConfetti(true);
    }, 3000);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-transparent text-foreground">
      <Card className="p-8 shadow-lg aspect-video w-[800px]">
        <CardHeader>
          <h1 className="text-2xl font-bold mb-4 text-center">
            SORTEIO DE BRINDES
          </h1>
        </CardHeader>
        <CardContent>
          {/* Se não estiver sorteando e ainda não houver ganhadores */}
          {!drawing && winners.length === 0 && (
            <div className="space-y-4">
              {/* Linha “Quero sortear [input] nomes” na mesma linha */}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Nº de sorteados</span>
                  <input
                    type="number"
                    min="1"
                    value={numToDraw}
                    onChange={(e) => setNumToDraw(e.target.value)}
                    className="border border-border rounded p-2 bg-input text-foreground w-20"
                  />
                </div>
              </div>
              {/* Campo para lista de nomes com scroll */}
              <div>
                <label className="block text-sm font-medium mt-2 mb-1">
                  Lista de nomes
                </label>
                <textarea
                  placeholder="Insira os nomes separados por vírgulas"
                  value={namesInput}
                  onChange={(e) => setNamesInput(e.target.value)}
                  className="border border-border rounded p-2 bg-input text-foreground w-full h-64 resize-y overflow-auto"
                />
              </div>
              <div>
                <Button
                  onClick={handleDraw}
                  className="bg-accent hover:opacity-90 text-foreground font-sans py-2 px-4 rounded w-full"
                >
                  Sortear agora
                </Button>
              </div>
            </div>
          )}

          {drawing && (
            <div className="mt-4 text-center">
              <p className="mb-2">Realizando sorteio...</p>
              <Progress value={progress} />
            </div>
          )}

          {/* Exibição dos ganhadores */}
          {!drawing && winners.length > 0 && drawTime && (
            <div className="mt-1 text-center">
              <h2 className="text-xl font-bold">Ganhadores:</h2>
              <ul className="mt-2 space-y-1">
                {winners.map((name, index) => (
                  <li key={index} className="text-4xl font-extrabold">
                    {name}
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">
                Sorteio realizado em: {drawTime.toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </div>
  );
};

export default App;


