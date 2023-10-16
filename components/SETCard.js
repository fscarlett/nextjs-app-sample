import { adaptMath } from '@/calc/formulas'

import styles from '@/styles/SETCard.module.css'

export default function SETCard({ values }) {
  return (
    <div>
      <h2 className={styles.set_card_h2}>Sequestration Equilibrium Timeline</h2>
      <p className={styles.set_card_years}>
        {adaptMath.years_to_sequestration(values).toFixed(1)} Years
      </p>
      <p className={styles.set_card_text}>to Sequester CO2 Emissions</p>
      <div className={styles.set_bar}>
        <div className={styles.set_indicator} id='set_indicator'></div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
                      #set_indicator { right: ${adaptMath
                        .years_to_sequestration(values)
                        .toFixed(1)}%; }
                    `,
          }}
        />
        <div className={styles.set_labels}>
          <div className={styles.set_label_100}>100</div>
          <div className={styles.set_label_50}>50</div>
          <div className={styles.set_label_zero}>0</div>
        </div>
      </div>
    </div>
  )
}
