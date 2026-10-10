/**
 * Parâmetros do motor de gamificação.
 *
 * Centralizados em um único módulo para que as regras de negócio sejam
 * auditáveis e ajustáveis sem alteração dos componentes de interface
 * (princípio da inversão de dependência / Open-Closed).
 */

/** XP concedido por questão respondida corretamente. */
export const XP_PER_CORRECT_ANSWER = 100;

/** Bônus concedido na primeira aprovação em um módulo. */
export const XP_MODULE_COMPLETION_BONUS = 100;

/** Quantidade de XP necessária para avançar um nível. */
export const XP_PER_LEVEL = 1000;

/**
 * Aproveitamento mínimo (%) exigido para aprovação em um módulo e
 * consequente desbloqueio do módulo seguinte da trilha.
 * O valor espelha a média institucional de aprovação (70).
 */
export const MIN_APPROVAL_SCORE = 70;

/** Chave utilizada para persistência local do progresso do estudante. */
export const STORAGE_KEY = 'engacademy:state:v1';
