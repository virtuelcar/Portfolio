/* Example note, shown only while the page is not yet connected to the n8n webhook. */
window.AGENT_FIXTURE = {
  ecommerce: {
    fr: {
      title: "Meta s'essouffle, Performance Max porte la croissance",
      summary: "D'août à octobre, le ROAS de Meta Ads est passé de 4,2 à 2,7 pendant que sa fréquence montait de 1,9 à 3,4 : les visuels s'usent. Performance Max progresse (ROAS de 6,4 en octobre) et réalise 66 % du chiffre d'affaires publicitaire avec 45 % du budget. Sur le site, la conversion mobile recule de 0,73 % à 0,55 %.",
      wins: [
        { text: "Performance Max améliore son ROAS chaque mois, de 5,8 en août à 6,4 en octobre.", figure: "ROAS 6,4" },
        { text: "La newsletter d'octobre génère 140 commandes et 14 200 CHF, son meilleur mois de la période.", figure: "14 200 CHF" },
        { text: "La conversion sur ordinateur passe de 1,70 % à 2,08 %.", figure: "2,08 %" }
      ],
      alerts: [
        { text: "Meta Ads : le coût par commande passe de 28,57 à 42,67 CHF, avec un CTR en baisse de 1,50 % à 1,05 % et une fréquence de 3,4. Signe probable de lassitude créative.", figure: "+49 %", severity: "high" },
        { text: "La conversion mobile recule de 0,73 % à 0,55 % alors que le mobile représente 72 % des sessions. Hypothèse : un frein dans le tunnel d'achat mobile.", figure: "0,55 %", severity: "high" }
      ],
      recommendations: [
        { priority: 1, action: "Renouveler les visuels Meta et plafonner la fréquence à 2,5", rationale: "La fréquence est passée de 1,9 à 3,4 et le CTR a perdu 30 % en trois mois.", expected_impact: "Retour du CTR vers 1,5 % et baisse du coût par commande. À suivre : CTR et coût par commande sur deux semaines.", effort: "medium" },
        { priority: 2, action: "Déplacer 20 % du budget Meta, soit environ 1 300 CHF, vers Performance Max", rationale: "Performance Max réalise 66 % du chiffre d'affaires publicitaire avec 45 % du budget, à un ROAS de 6,4 contre 2,7 pour Meta.", expected_impact: "ROAS global au-dessus des 4,4 d'octobre. À suivre chaque semaine, pour vérifier que Performance Max garde son rendement avec plus de budget.", effort: "low" },
        { priority: 3, action: "Auditer le parcours d'achat sur mobile", rationale: "La conversion mobile a perdu un quart de sa valeur (0,73 % à 0,55 %) alors que l'ordinateur progresse.", expected_impact: "Trouver le point de blocage : paiement, formulaire ou vitesse. À suivre : conversion mobile.", effort: "medium" }
      ],
      human_check: "Vérifier qu'aucun changement de suivi (pixel Meta, bannière de consentement) n'explique une partie de la baisse de Meta et du mobile. Le déplacement de budget suppose que Performance Max garde son rendement à budget plus élevé."
    },
    en: {
      title: "Meta is running out of steam, Performance Max drives growth",
      summary: "From August to October, Meta Ads ROAS fell from 4.2 to 2.7 while frequency rose from 1.9 to 3.4: the creatives are wearing out. Performance Max keeps improving (ROAS of 6.4 in October) and brings 66% of ad revenue with 45% of the budget. On the website, mobile conversion fell from 0.73% to 0.55%.",
      wins: [
        { text: "Performance Max improved its ROAS every month, from 5.8 in August to 6.4 in October.", figure: "ROAS 6.4" },
        { text: "The October newsletter brought 140 orders and CHF 14,200, its best month of the period.", figure: "CHF 14,200" },
        { text: "Desktop conversion rose from 1.70% to 2.08%.", figure: "2.08%" }
      ],
      alerts: [
        { text: "Meta Ads: cost per order went from CHF 28.57 to CHF 42.67, with CTR down from 1.50% to 1.05% and a frequency of 3.4. Likely creative fatigue.", figure: "+49%", severity: "high" },
        { text: "Mobile conversion fell from 0.73% to 0.55% while mobile makes up 72% of sessions. Hypothesis: friction in the mobile checkout.", figure: "0.55%", severity: "high" }
      ],
      recommendations: [
        { priority: 1, action: "Refresh the Meta creatives and cap frequency at 2.5", rationale: "Frequency rose from 1.9 to 3.4 and CTR lost 30% in three months.", expected_impact: "CTR back towards 1.5% and a lower cost per order. Watch CTR and cost per order over two weeks.", effort: "medium" },
        { priority: 2, action: "Move 20% of the Meta budget, about CHF 1,300, to Performance Max", rationale: "Performance Max brings 66% of ad revenue with 45% of the budget, at a ROAS of 6.4 against 2.7 for Meta.", expected_impact: "Overall ROAS above October's 4.4. Check weekly that Performance Max holds its return with more budget.", effort: "low" },
        { priority: 3, action: "Audit the mobile checkout journey", rationale: "Mobile conversion lost a quarter of its value (0.73% to 0.55%) while desktop improved.", expected_impact: "Find the blocking point: payment, form or speed. Watch mobile conversion.", effort: "medium" }
      ],
      human_check: "Check that no tracking change (Meta pixel, consent banner) explains part of the Meta and mobile decline. The budget shift assumes Performance Max keeps its return at a higher budget."
    }
  }
};
