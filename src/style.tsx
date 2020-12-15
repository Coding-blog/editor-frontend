import { RendererLike } from 'render-jsx';

export function Style(_: unknown, renderer: RendererLike<Node>) {
  return <style>{`
    body, * {
      font-family: 'Hind', sans-serif;
    }

    body {
      background: #f5f5f5;
      background-image: url('/assets/dots-bounded.svg');
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
      color: #363062;
    }

    .container {
      margin: 72px auto;
      max-width: 768px;
      padding: 0px 136px;
      position: relative;
    }

    input, textarea, select, .input {
      display: block;
      width: calc(100% - 16px);
      border: 1px solid transparent;
      border-radius: 3px;
      background: white;
      padding: 6px;
      outline: none;
      margin-bottom: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .12);
      resize: vertical;
      transition: box-shadow .15s, transform .15s, border-color .15s;
    }

    select {
      width: 100%;
    }

    label {
      font-size: 12px;
      font-weight: bold;
      display: block;
    }

    input ~ label, textarea ~ label, select ~ label, .input ~ label {
      margin-top: 24px;
    }

    input:focus, textarea:focus, select:focus, .input.focused {
      box-shadow: 0 6px 18px #36306222;
      transform: translateY(-1px);
    }

    input[readonly], textarea[readonly], select[readonly], .input.readonly {
      box-shadow: 0 1px 3px rgba(0, 0, 0, .12);
      transform: none;
      background: #f5f5f5;
    }

    input.error, textarea.error, select.error, .input.error {
      border-color: #f05454;
    }

    button {
      color: #363062;
      background: white;
      border: none;
      outline: none;
      cursor: pointer;
      border-radius: 3px;
      height: 36px;
      min-width: 96px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      box-shadow: 0 6px 18px rgba(0, 0, 0, .06);
      transition: box-shadow .15s, transform.15s, background .15s, opacity .15s;
    }

    button:hover {
      box-shadow: 0 11px 33px rgba(0, 0, 0, .12);
      transform: translateY(-1px);
      background: #f5f5f5;
    }

    button[disabled], button:active {
      transform: translateY(1px);
      background: #f5f5f5;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .08);
    }

    button[disabled] { cursor: initial; opacity: .75 }

    hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 24px 0;
    }
  `}</style>;
}
