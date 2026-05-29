import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma.js";

const demoUser = {
  name: "Demo Engenharia de Producao",
  email: "demo@gbriel.com",
  password: "demo123456",
};

const subjects = [
  "Custos Industriais",
  "Pesquisa Operacional",
  "PCP",
  "Gestao da Qualidade",
  "Logistica",
  "Ergonomia",
  "Engenharia Economica",
  "Processos de Fabricacao",
];

const types = [
  "Formula",
  "Slide do Professor",
  "Foto da Lousa",
  "PDF",
  "Resumo",
  "Estudo de Caso",
];

const materials = [
  {
    subject: "Custos Industriais",
    materialType: "Formula",
    contextText: "Essa formula calcula o ponto de equilibrio quando a receita cobre exatamente os custos fixos e variaveis.",
    noteText: "Ponto de equilibrio = custo fixo / (preco unitario - custo variavel unitario). Usar quando a margem de contribuicao for positiva.",
  },
  {
    subject: "Custos Industriais",
    materialType: "Foto da Lousa",
    contextText: "A lousa comparava custeio por absorcao e custeio variavel para decidir como tratar custos fixos de fabricacao.",
    noteText: "Absorcao entra no estoque; variavel separa custo fixo como despesa do periodo. Cai em prova com DRE.",
  },
  {
    subject: "Pesquisa Operacional",
    materialType: "Formula",
    contextText: "Modelo de programacao linear para maximizar lucro respeitando restricoes de maquina, materia-prima e demanda.",
    noteText: "Definir variaveis x1 e x2, funcao objetivo Z, depois restricoes. Verificar regiao viavel e vertices.",
  },
  {
    subject: "Pesquisa Operacional",
    materialType: "Slide do Professor",
    contextText: "Metodo Simplex usado quando o problema tem muitas variaveis e nao da para resolver so pelo grafico.",
    noteText: "Comecar com variaveis de folga, montar tableau e escolher coluna mais negativa para maximizar.",
  },
  {
    subject: "PCP",
    materialType: "Resumo",
    contextText: "MRP explode a demanda independente do produto final em necessidades dependentes de componentes.",
    noteText: "Entradas: MPS, lista de materiais e estoque. Saidas: ordens planejadas de compra e producao.",
  },
  {
    subject: "PCP",
    materialType: "Formula",
    contextText: "Lote economico de compra equilibra custo de pedido com custo de manter estoque.",
    noteText: "LEC = raiz de 2DS/H. D demanda anual, S custo por pedido, H custo de armazenagem anual por unidade.",
  },
  {
    subject: "Gestao da Qualidade",
    materialType: "PDF",
    contextText: "PDCA organiza melhoria continua: planejar, executar, checar resultados e agir padronizando ou corrigindo.",
    noteText: "Relacionar com MASP e ferramentas da qualidade como Ishikawa, Pareto e 5 Porques.",
  },
  {
    subject: "Gestao da Qualidade",
    materialType: "Estudo de Caso",
    contextText: "O caso usava Grafico de Pareto para priorizar defeitos que mais impactavam retrabalho na linha.",
    noteText: "Regra 80/20: poucos tipos de falha explicam grande parte das perdas. Bom exemplo para apresentacao.",
  },
  {
    subject: "Logistica",
    materialType: "Slide do Professor",
    contextText: "Curva ABC classifica itens de estoque por relevancia financeira para definir controle mais rigoroso.",
    noteText: "Classe A tem menor quantidade e maior valor. Classe C tem muitos itens com baixo impacto financeiro.",
  },
  {
    subject: "Logistica",
    materialType: "Formula",
    contextText: "Estoque de seguranca protege contra variacao de demanda e atraso de fornecedor durante o lead time.",
    noteText: "Quanto maior incerteza e nivel de servico, maior o estoque de seguranca. Conectar com ponto de pedido.",
  },
  {
    subject: "Ergonomia",
    materialType: "Foto da Lousa",
    contextText: "Aula sobre analise ergonomica do trabalho para reduzir fadiga, movimentos repetitivos e risco de afastamento.",
    noteText: "AET olha tarefa real, postura, ritmo, ambiente, ferramentas e organizacao do trabalho.",
  },
  {
    subject: "Engenharia Economica",
    materialType: "Formula",
    contextText: "VPL compara entradas e saidas trazidas a valor presente para decidir se um investimento cria valor.",
    noteText: "Se VPL maior que zero, o projeto supera a taxa minima de atratividade. Comparar tambem com TIR.",
  },
  {
    subject: "Engenharia Economica",
    materialType: "Resumo",
    contextText: "Payback mede em quanto tempo o investimento inicial volta, mas ignora valor do dinheiro no tempo se for simples.",
    noteText: "Usar payback descontado quando a aula pedir taxa de desconto. Nao avaliar projeto so por payback.",
  },
  {
    subject: "Processos de Fabricacao",
    materialType: "PDF",
    contextText: "Comparacao entre usinagem, fundicao e conformacao para escolher processo conforme volume, tolerancia e material.",
    noteText: "Usinagem tem boa precisao, mas pode gerar perda de material. Fundicao atende geometrias complexas.",
  },
];

function searchText(material: (typeof materials)[number]) {
  return [
    material.subject,
    material.materialType,
    material.contextText,
    material.noteText,
  ]
    .join(" ")
    .toLowerCase();
}

async function main() {
  const passwordHash = await bcrypt.hash(demoUser.password, 10);

  const user = await prisma.user.upsert({
    where: { email: demoUser.email },
    update: {
      name: demoUser.name,
      password: passwordHash,
    },
    create: {
      name: demoUser.name,
      email: demoUser.email,
      password: passwordHash,
    },
  });

  await Promise.all(
    subjects.map((name) =>
      prisma.studySubject.upsert({
        where: {
          user_id_name: {
            user_id: user.id,
            name,
          },
        },
        update: {},
        create: {
          user_id: user.id,
          name,
        },
      }),
    ),
  );

  await Promise.all(
    types.map((name) =>
      prisma.studyMaterialType.upsert({
        where: {
          user_id_name: {
            user_id: user.id,
            name,
          },
        },
        update: {},
        create: {
          user_id: user.id,
          name,
        },
      }),
    ),
  );

  await prisma.studyMaterial.deleteMany({
    where: {
      user_id: user.id,
      subject: {
        in: subjects,
      },
    },
  });

  await prisma.studyMaterial.createMany({
    data: materials.map((material) => ({
      user_id: user.id,
      subject: material.subject,
      material_type: material.materialType,
      context_text: material.contextText,
      note_text: material.noteText,
      file_url: null,
      file_name: null,
      file_mime: null,
      audio_url: null,
      audio_name: null,
      audio_mime: null,
      search_text: searchText(material),
    })),
  });

  console.log(`Demo criado: ${demoUser.email} / ${demoUser.password}`);
  console.log(`${subjects.length} materias, ${types.length} tipos e ${materials.length} materiais inseridos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
