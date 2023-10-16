import { adaptMath } from '@/calc/formulas'
// import { constants } from '@/calc/constants'
import styles from '@/styles/CssCharts.module.css'

export default function ImproveProjectCSSChart({
  values,
  seq,
  seqTotal,
  emissionsTotal,
}) {
  let totalCarbon = adaptMath.total_carbon(values)

  let reduce_emissions_percent = emissionsTotal / (seqTotal + emissionsTotal)

  let increase_seq_percent = seqTotal / (seqTotal + emissionsTotal)

  return (
    <div>
      <div>
        <style
          dangerouslySetInnerHTML={{
            __html: `
      #improve_donut { background: conic-gradient(
        #239c93 0deg ${increase_seq_percent * 360}deg,
        #d36e3b ${increase_seq_percent * 360}deg 360deg
      );}
    `,
          }}
        />
        <div className={styles.improve_donut} id='improve_donut'>
          <div className={styles.improve_hole}></div>
        </div>
      </div>
    </div>
  )
}
