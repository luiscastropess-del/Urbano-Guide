# Configurações de Integração de Plataformas para Agentes Gemini

Este documento contém os prompts de configuração para alinhar os Agentes Gemini (AI) responsáveis pela manutenção e expansão das plataformas complementares do Ecossistema Urbano Holambra:
- PGuia (https://pguia.onrender.com)
- AdminGuide (https://adminguide.onrender.com)

## Instruções para o Gemini (PGuia)

```markdown
# [SYSTEM] PGuia Integration Directives

### Contexto
O portal central (Urbano Holambra) agora possui perfis dinâmicos para Guias Locais que suportam **Planos de Assinatura (Free e Pro/Premium)**. A vitrine gratuita dos guias foi atualizada e agora se baseia num modelo de *Profile Glassmorphism* focado apenas na divulgação do currículo e pacotes limitados.

### Ação Imediata na Base de Dados
A partir de agora, o banco de dados oficial (vínculo via Prisma schema / URL Neon DB) contém a coluna `plan` na tabela `GuideProfile` (valores aceitos: `"free", "pro", "ultimate"`).

### Atualização da UI no PGuia
Ao exibir o status do plano na Dashboard do Guia local (https://pguia.onrender.com):
1. **Guias Free**: Emita um card de Upsell "Quer mais visibilidade?" oferecendo os planos `Pro` e detalhe que na página pública do Urbano Holambra eles agora terão 1 Pacote em destaque e limite de exibição de Roteiros (2 roteiros).
2. **Edição do Perfil**: Restrinja o formulário do guia de forma que, se `plan == "free"`, fotos carregadas para o slider não apareçam acima da cota da galeria (máximo de 5 ícones/fotos).
3. **Link Único:** Atualize a página do dashboard fornecendo o "Link Único" do Guia de volta para o Urbano Holambra no formato `/guias/[id_do_guia]`.
```

## Instruções para o Gemini (AdminGuide)

```markdown
# [SYSTEM] AdminGuide Integration Directives

### Contexto
Painel Administrativo da Redes PGuia (https://adminguide.onrender.com). Foram implementadas novas interfaces de perfil gratuito nos aplicativos cliente do "Urbano Holambra". 

### Ação Imediata: Gestão de Planos
1. **Nova métrica na Tabela `GuideProfile`:** A coluna `plan` precisa ser visualizável na lista de "Guids Pendentes e Aprovados".
2. Na tela de aprovação de guias, definir por default `plan: "free"` no evento de "Aprovar Cadastro".
3. Criar uma nova tabela/tab na UI central listando a contagem de "Guias Free" vs "Guias Pro". 

### Integração de Faturamento e Permissões
1. O painel deve disponibilizar gatilhos (Triggers) para fazer um upgrade na rota PATCH do Prisma:
   `await prisma.guideProfile.update({ where: { id }, data: { plan: "pro" }})`
   Sempre que um comprovante de pagamento de upgrade for aprovado no app adminguide, acione esta rota.
```
