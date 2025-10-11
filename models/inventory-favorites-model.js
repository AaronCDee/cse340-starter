const pool = require("../database/")

async function getInventoryFavoritesByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT DISTINCT ON (i.inv_id)
        i.*,
        inv_favs.account_id
      FROM public.inventory_favorite AS inv_favs
      JOIN public.inventory AS i
        ON inv_favs.inventory_id = i.inv_id
      WHERE inv_favs.account_id = $1
      ORDER BY i.inv_id`,
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryFavoritesByAccountId error " + error)
    throw error
  }
}


async function createInventoryFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO inventory_favorite (account_id, inventory_id) VALUES ($1, $2) RETURNING *"
    return await pool.query(sql, [account_id, inv_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Delete Inventory Favorite
 * ************************** */
 async function deleteInventoryFavorite(account_id, inventory_id) {
  try {
    const sql = 'DELETE FROM inventory_favorite WHERE account_id = $1 AND inventory_id = $2'
    const data = await pool.query(sql, [account_id, inventory_id])

    return data
  } catch (error) {
    new Error("Delete Inventory Favorite Error")
  }
}

module.exports = { getInventoryFavoritesByAccountId, createInventoryFavorite, deleteInventoryFavorite }
