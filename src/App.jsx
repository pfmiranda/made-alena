import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const BROWNIE_PHOTO = "https://dkfcqkaolajjjfiiqjep.supabase.co/storage/v1/object/public/recipe-photos/brownies.jpg";

const SEED_RECIPE = {
  title: "Fudgy Brownies",
  emoji: "🍫",
  category: "Baking",
  tags: ["chocolate", "dessert", "baking"],
  servings: 9,
  prep_time: "15 min",
  bake_time: "25–30 min",
  total_time: "~2 hrs (incl. freeze)",
  difficulty: "Easy",
  calories: 172,
  total_calories: 1548,
  notes: "Freeze for 1 hour before cutting for cleaner slices and better fudgy texture. The freezing step is the secret!",
  ingredients: [
    { amount: "1 large", item: "egg (~50–55g)" },
    { amount: "60–70g", item: "sugar" },
    { amount: "80g", item: "dark chocolate (compound)" },
    { amount: "20g", item: "milk chocolate (compound)" },
    { amount: "50g", item: "oil or butter" },
    { amount: "1 tsp", item: "instant coffee" },
    { amount: "1 tsp", item: "vanilla essence" },
    { amount: "1 pinch", item: "salt" },
    { amount: "50g", item: "all-purpose flour" },
    { amount: "15g", item: "cocoa powder" },
  ],
  steps: [
    "Whisk together the egg, sugar, and vanilla essence until sugar is mostly dissolved and mixture looks smooth and slightly thickened.",
    "Melt the chocolate with the oil/butter. Add the coffee while it's warm.",
    "Slowly pour the warm chocolate mixture into the egg mixture and mix well.",
    "Sift in the flour, cocoa powder, and salt.",
    "Fold everything together gently until combined. Don't overmix.",
    "Pour into a lined 6×6 inch pan.",
    "Bake at 170–180°C for about 25–30 minutes.",
    "Cool completely at room temperature, then freeze for 1 hour before cutting.",
  ],
  nutrition_breakdown: [
    { item: "Egg", kcal: 78 },
    { item: "Sugar", kcal: 251 },
    { item: "Dark Choc", kcal: 440 },
    { item: "Milk Choc", kcal: 105 },
    { item: "Oil", kcal: 442 },
    { item: "Flour", kcal: 182 },
    { item: "Cocoa", kcal: 36 },
    { item: "Other", kcal: 14 },
  ],
  photo_url: BROWNIE_PHOTO,
};

const CATEGORIES = ["All", "Baking", "Mains", "Snacks", "Drinks", "Salads", "Soups", "Other"];

const EMPTY_RECIPE = {
  title: "", emoji: "🍽️", category: "Other", tags: [],
  servings: 4, prep_time: "", bake_time: "", total_time: "",
  difficulty: "Medium", calories: 0, total_calories: 0,
  notes: "", ingredients: [{ amount: "", item: "" }],
  steps: [""], nutrition_breakdown: [], photo_url: "",
};

function NutritionBar({ breakdown, total }) {
  const colors = ["#c0392b","#e67e22","#f1c40f","#27ae60","#2980b9","#8e44ad","#16a085","#d35400"];
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", gap: 1 }}>
        {breakdown.map((b, i) => (
          <div key={i} title={`${b.item}: ${b.kcal} kcal`}
            style={{ width: `${(b.kcal / total) * 100}%`, background: colors[i % colors.length] }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 6 }}>
        {breakdown.map((b, i) => (
          <span key={i} style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[i % colors.length], display: "inline-block" }} />
            {b.item} {b.kcal}
          </span>
        ))}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#fff", borderRadius: 18, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer",
      border: "1.5px solid #f0ebe3", transition: "all 0.2s",
      fontFamily: "'Georgia', serif",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
    >
      {/* Thumbnail */}
      <div style={{ width: "100%", height: 160, background: "#f5ede0", overflow: "hidden", position: "relative" }}>
        {recipe.photo_url ? (
          <img src={recipe.photo_url} alt={recipe.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
            {recipe.emoji}
          </div>
        )}
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(44,24,16,0.75)", borderRadius: 20, padding: "3px 10px", fontSize: 11, color: "#f0d5b0", fontFamily: "sans-serif" }}>
          {recipe.category}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          {!recipe.photo_url && <span style={{ fontSize: 20 }}>{recipe.emoji}</span>}
          <div style={{ fontWeight: 700, fontSize: 15, color: "#2c1810", lineHeight: 1.3 }}>{recipe.title}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontSize: 11, background: "#f0f8ee", color: "#4a7c3f", padding: "2px 8px", borderRadius: 20, fontFamily: "sans-serif" }}>{recipe.difficulty}</span>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888", fontFamily: "sans-serif" }}>
          <span>⏱ {recipe.total_time || recipe.totalTime || "—"}</span>
          <span>🔥 {recipe.calories} kcal</span>
        </div>
      </div>
    </div>
  );
}

export default function MadeAlena() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY_RECIPE);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadRecipes(); }, []);

  async function loadRecipes() {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    const { data, error } = await supabase.from("recipes").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) {
      setRecipes(data);
    } else {
      // Seed brownie on first load
      const { data: inserted } = await supabase.from("recipes").insert(SEED_RECIPE).select();
      if (inserted) setRecipes(inserted);
    }
    setLoading(false);
  }

  async function saveRecipe() {
    if (!form.title.trim() || !supabase) return;
    const { id, created_at, ...rest } = form;
    if (id) {
      const { data } = await supabase.from("recipes").update(rest).eq("id", id).select();
      if (data) setRecipes(rs => rs.map(r => r.id === id ? data[0] : r));
    } else {
      const { data } = await supabase.from("recipes").insert(rest).select();
      if (data) setRecipes(rs => [data[0], ...rs]);
    }
    setView("grid");
    setForm(EMPTY_RECIPE);
  }

  async function deleteRecipe(id) {
    await supabase.from("recipes").delete().eq("id", id);
    setRecipes(rs => rs.filter(r => r.id !== id));
    setView("grid");
  }

  async function uploadPhoto(file) {
    if (!supabase || !file) return null;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("recipe-photos").upload(filename, file, { upsert: true });
    setUploading(false);
    if (error) { alert("Photo upload failed: " + error.message); return null; }
    return supabase.storage.from("recipe-photos").getPublicUrl(filename).data.publicUrl;
  }

  function openRecipe(r) { setSelected(r); setActiveTab("ingredients"); setView("detail"); }
  function startEdit(r) { setForm({ ...r }); setView("edit"); }

  const filtered = recipes.filter(r => {
    const matchCat = category === "All" || r.category === category;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1.5px solid #e8ddd0", fontFamily: "Georgia, serif",
    fontSize: 14, color: "#2c1810", background: "#fdfaf7",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 12, color: "#888", fontFamily: "sans-serif", marginBottom: 4, display: "block", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" };

  // ─── DETAIL VIEW ───
  if (view === "detail" && selected) {
    const r = recipes.find(x => x.id === selected.id) || selected;
    return (
      <div style={{ minHeight: "100vh", background: "#faf6f0", fontFamily: "Georgia, serif" }}>
        <div style={{ background: "#2c1810", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setView("grid")} style={{ background: "none", border: "none", color: "#f0d5b0", fontSize: 20, cursor: "pointer", padding: 0 }}>←</button>
          <span style={{ color: "#f0d5b0", fontWeight: 700, fontSize: 18, flex: 1 }}>{r.emoji} {r.title}</span>
          <button onClick={() => startEdit(r)} style={{ background: "#c0682a", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>Edit</button>
        </div>

        {/* Hero photo */}
        {r.photo_url && (
          <div style={{ width: "100%", maxHeight: 320, overflow: "hidden" }}>
            <img src={r.photo_url} alt={r.title} style={{ width: "100%", height: 320, objectFit: "cover" }} />
          </div>
        )}

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Prep", val: r.prep_time || "—" },
              { label: "Cook", val: r.bake_time || "—" },
              { label: "Total", val: r.total_time || "—" },
              { label: "Servings", val: r.servings },
              { label: "Difficulty", val: r.difficulty },
            ].map(m => (
              <div key={m.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 10px", textAlign: "center", border: "1.5px solid #f0ebe3" }}>
                <div style={{ fontSize: 11, color: "#aaa", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</div>
                <div style={{ fontWeight: 700, color: "#2c1810", marginTop: 2 }}>{m.val}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "linear-gradient(135deg, #c0682a, #2c1810)", borderRadius: 16, padding: "16px 20px", color: "#fff", marginBottom: 20 }}>
            <div style={{ fontSize: 13, opacity: 0.8, fontFamily: "sans-serif" }}>Per serving ({r.servings} servings)</div>
            <div style={{ fontSize: 32, fontWeight: 700, margin: "4px 0" }}>{r.calories} <span style={{ fontSize: 16, fontWeight: 400 }}>kcal</span></div>
            <div style={{ fontSize: 12, opacity: 0.7, fontFamily: "sans-serif" }}>Total batch: {r.total_calories} kcal</div>
            {r.nutrition_breakdown?.length > 0 && <NutritionBar breakdown={r.nutrition_breakdown} total={r.total_calories} />}
          </div>

          {r.tags?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {r.tags.map(t => <span key={t} style={{ background: "#fdf3e8", color: "#c0682a", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontFamily: "sans-serif" }}>#{t}</span>)}
            </div>
          )}

          <div style={{ display: "flex", gap: 4, background: "#f0ebe3", borderRadius: 12, padding: 4, marginBottom: 16 }}>
            {["ingredients", "method", "notes"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: "8px 0", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "Georgia, serif",
                background: activeTab === tab ? "#2c1810" : "none",
                color: activeTab === tab ? "#fff" : "#888", fontSize: 13, fontWeight: activeTab === tab ? 700 : 400,
                transition: "all 0.2s",
              }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
            ))}
          </div>

          {activeTab === "ingredients" && (
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1.5px solid #f0ebe3" }}>
              {r.ingredients.map((ing, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: i < r.ingredients.length - 1 ? "1px solid #f5f0eb" : "none", alignItems: "center" }}>
                  <span style={{ minWidth: 70, fontWeight: 700, color: "#c0682a", fontSize: 13 }}>{ing.amount}</span>
                  <span style={{ color: "#2c1810", fontSize: 14 }}>{ing.item}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "method" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {r.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 14, background: "#fff", borderRadius: 14, padding: "14px 16px", border: "1.5px solid #f0ebe3" }}>
                  <div style={{ minWidth: 28, height: 28, background: "#2c1810", borderRadius: "50%", color: "#f0d5b0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                  <p style={{ margin: 0, color: "#2c1810", lineHeight: 1.6, fontSize: 14 }}>{step}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "notes" && (
            <div style={{ background: "#fff8f0", borderRadius: 16, padding: "20px", border: "1.5px solid #f0d5b0" }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>📝</div>
              <p style={{ margin: 0, color: "#2c1810", lineHeight: 1.7, fontSize: 14 }}>{r.notes || "No notes yet."}</p>
            </div>
          )}

          <button onClick={() => deleteRecipe(r.id)} style={{ marginTop: 32, width: "100%", padding: "12px", background: "none", border: "1.5px solid #e8ddd0", color: "#aaa", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>
            🗑 Delete Recipe
          </button>
        </div>
      </div>
    );
  }

  // ─── ADD / EDIT FORM ───
  if (view === "add" || view === "edit") {
    return (
      <div style={{ minHeight: "100vh", background: "#faf6f0", fontFamily: "Georgia, serif" }}>
        <div style={{ background: "#2c1810", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => { setView("grid"); setForm(EMPTY_RECIPE); }} style={{ background: "none", border: "none", color: "#f0d5b0", fontSize: 20, cursor: "pointer", padding: 0 }}>←</button>
          <span style={{ color: "#f0d5b0", fontWeight: 700, fontSize: 18 }}>{view === "edit" ? "Edit Recipe" : "New Recipe"}</span>
          <button onClick={saveRecipe} style={{ marginLeft: "auto", background: "#c0682a", border: "none", color: "#fff", padding: "6px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 60px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Photo upload */}
          <div>
            <label style={labelStyle}>Photo</label>
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1.5px dashed #e8ddd0", background: "#fdfaf7", cursor: "pointer", position: "relative", minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => document.getElementById("photo-upload").click()}>
              {form.photo_url ? (
                <img src={form.photo_url} alt="preview" style={{ width: "100%", height: 200, objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center", color: "#aaa", padding: 20 }}>
                  <div style={{ fontSize: 36 }}>📷</div>
                  <div style={{ fontSize: 13, fontFamily: "sans-serif", marginTop: 8 }}>Tap to add a photo</div>
                </div>
              )}
              <input id="photo-upload" type="file" accept="image/*" style={{ display: "none" }}
                onChange={async e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const url = await uploadPhoto(file);
                  if (url) setForm(f => ({ ...f, photo_url: url }));
                }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Emoji</label>
              <input style={{ ...inputStyle, fontSize: 28, textAlign: "center" }} value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} maxLength={2} />
            </div>
            <div>
              <label style={labelStyle}>Recipe Name</label>
              <input style={inputStyle} value={form.title} placeholder="e.g. Chocolate Cake" onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Difficulty</label>
              <select style={inputStyle} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                {["Easy", "Medium", "Hard"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            {[["prep_time", "Prep"], ["bake_time", "Cook"], ["total_time", "Total"], ["servings", "Servings"]].map(([key, lbl]) => (
              <div key={key}>
                <label style={labelStyle}>{lbl}</label>
                <input style={inputStyle} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={lbl === "Servings" ? "4" : "e.g. 15 min"} />
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Calories / serving</label>
              <input type="number" style={inputStyle} value={form.calories} onChange={e => setForm(f => ({ ...f, calories: +e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Total batch kcal</label>
              <input type="number" style={inputStyle} value={form.total_calories} onChange={e => setForm(f => ({ ...f, total_calories: +e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Tags (comma separated)</label>
            <input style={inputStyle} value={form.tags?.join(", ")} placeholder="chocolate, dessert, easy"
              onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))} />
          </div>

          <div>
            <label style={labelStyle}>Ingredients</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.ingredients.map((ing, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 30px", gap: 8, alignItems: "center" }}>
                  <input style={inputStyle} placeholder="Amount" value={ing.amount} onChange={e => { const arr = [...form.ingredients]; arr[i] = { ...arr[i], amount: e.target.value }; setForm(f => ({ ...f, ingredients: arr })); }} />
                  <input style={inputStyle} placeholder="Ingredient" value={ing.item} onChange={e => { const arr = [...form.ingredients]; arr[i] = { ...arr[i], item: e.target.value }; setForm(f => ({ ...f, ingredients: arr })); }} />
                  <button onClick={() => setForm(f => ({ ...f, ingredients: f.ingredients.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 18 }}>×</button>
                </div>
              ))}
              <button onClick={() => setForm(f => ({ ...f, ingredients: [...f.ingredients, { amount: "", item: "" }] }))} style={{ background: "none", border: "1.5px dashed #e8ddd0", color: "#c0682a", padding: "8px", borderRadius: 10, cursor: "pointer", fontFamily: "Georgia, serif" }}>+ Add Ingredient</button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Method / Steps</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.steps.map((step, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 30px", gap: 8, alignItems: "start" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
                    <div style={{ minWidth: 24, height: 24, background: "#2c1810", borderRadius: "50%", color: "#f0d5b0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, marginTop: 10 }}>{i + 1}</div>
                    <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} value={step} onChange={e => { const arr = [...form.steps]; arr[i] = e.target.value; setForm(f => ({ ...f, steps: arr })); }} placeholder={`Step ${i + 1}`} />
                  </div>
                  <button onClick={() => setForm(f => ({ ...f, steps: f.steps.filter((_, j) => j !== i) }))} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 18, marginTop: 8 }}>×</button>
                </div>
              ))}
              <button onClick={() => setForm(f => ({ ...f, steps: [...f.steps, ""] }))} style={{ background: "none", border: "1.5px dashed #e8ddd0", color: "#c0682a", padding: "8px", borderRadius: 10, cursor: "pointer", fontFamily: "Georgia, serif" }}>+ Add Step</button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Notes & Tips</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any tips, variations, or personal notes..." />
          </div>
        </div>
      </div>
    );
  }

  // ─── GRID VIEW ───
  return (
    <div style={{ minHeight: "100vh", background: "#faf6f0", fontFamily: "Georgia, serif" }}>
      <div style={{ background: "#2c1810", padding: "20px 20px 0" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h1 style={{ color: "#f0d5b0", margin: 0, fontSize: 26, letterSpacing: -0.5 }}>🍽️ Made-Alena</h1>
              <p style={{ color: "#a07850", margin: "2px 0 0", fontSize: 12, fontFamily: "sans-serif" }}>
                {loading ? "Loading..." : `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} saved`}
              </p>
            </div>
            <button onClick={() => { setForm(EMPTY_RECIPE); setView("add"); }} style={{ background: "#c0682a", border: "none", color: "#fff", padding: "10px 16px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "Georgia, serif" }}>
              + New
            </button>
          </div>
          <input style={{ width: "100%", padding: "10px 16px", borderRadius: 12, border: "none", fontFamily: "Georgia, serif", fontSize: 14, color: "#2c1810", background: "#f5ede0", boxSizing: "border-box", outline: "none", marginBottom: 14 }}
            placeholder="🔍  Search recipes or tags..." value={search} onChange={e => setSearch(e.target.value)} />
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                whiteSpace: "nowrap", padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                background: category === cat ? "#f0d5b0" : "rgba(255,255,255,0.1)",
                color: category === cat ? "#2c1810" : "#c0a07a", fontFamily: "Georgia, serif", fontSize: 13, fontWeight: category === cat ? 700 : 400,
              }}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 16px 60px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#bbb" }}>
            <div style={{ fontSize: 36 }}>⏳</div>
            <p style={{ fontFamily: "sans-serif", marginTop: 12 }}>Loading recipes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#bbb" }}>
            <div style={{ fontSize: 48 }}>🍽️</div>
            <p style={{ fontFamily: "sans-serif", marginTop: 12 }}>No recipes found.<br />Add your first one!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {filtered.map(r => <RecipeCard key={r.id} recipe={r} onClick={() => openRecipe(r)} />)}
          </div>
        )}
      </div>
    </div>
  );
}
